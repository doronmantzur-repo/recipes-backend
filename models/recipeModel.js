const fs = require("fs");
const { sequelize } = require("../db/models/index.js");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

async function getRecipes(userId) {
  let query = "SELECT * FROM recipes WHERE user_id = ?";
  const [recipes] = await sequelize.query(query, {
    replacements: [userId],
  });
  return recipes;
}

async function getRecipeById(id) {
  let query = "SELECT * FROM recipes WHERE id = ?";
  const [recipes] = await sequelize.query(query, {
    replacements: [id],
  });
  return recipes[0];
}

async function addRecipe(newRecipe, userId, filePath) {
  let secure_url;
  if (filePath) {
    //it is bette to implement this in a retries mechanism
    try {
      secure_url = await cloudinary.uploader.upload(filePath);
      console.log(secure_url);
    } catch (error) {
      throw new Error("Error uploading image to Cloudinary");
    } finally {
      if (secure_url) {
        fs.unlinkSync(filePath);
      }
    }
  }
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const sql = `
    INSERT INTO recipes (
  id,
  user_id,
  title,
  description,
  ingredients,
  instructions,
  cooking_time,
  servings,
  difficulty,
  image_url,
  is_public,
  created_at,
  updated_at
)
VALUES (
  :id,
  :user_id,
  :title,
  :description,
  :ingredients,
  :instructions,
  :cooking_time,
  :servings,
  :difficulty,
  :image_url,
  :is_public,
  :created_at,
  :updated_at
)
RETURNING *;
  `;
  try {
    const [result, metadata] = await sequelize.query(sql, {
      replacements: {
        id,
        user_id: userId,
        title: newRecipe.title,
        description: newRecipe.description,
        ingredients: `{${newRecipe.ingredients.join(",")}}`,
        instructions: `{${newRecipe.instructions.join(",")}}`,
        cooking_time: newRecipe.cooking_time,
        servings: newRecipe.servings,
        difficulty: newRecipe.difficulty,
        image_url: filePath,
        is_public: newRecipe.is_public ?? true,
        created_at: createdAt,
        updated_at: updatedAt,
      },
    });
    return result[0];
  } catch (error) {
    throw error;
  }
}

async function updateRecipe(id, updatedRecipe, userId) {
  const updatedAt = new Date().toISOString();

  // Convert JS arrays → Postgres varchar[] literals
  const ingredientsLiteral = updatedRecipe.ingredients
    ? `{${updatedRecipe.ingredients.join(",")}}`
    : null;

  const instructionsLiteral = updatedRecipe.instructions
    ? `{${updatedRecipe.instructions.join(",")}}`
    : null;

  const sql = `
    UPDATE recipes
    SET
      title = COALESCE(:title, title),
      description = COALESCE(:description, description),
      ingredients = COALESCE(:ingredients, ingredients),
      instructions = COALESCE(:instructions, instructions),
      cooking_time = COALESCE(:cooking_time, cooking_time),
      servings = COALESCE(:servings, servings),
      difficulty = COALESCE(:difficulty, difficulty),
      image_url = COALESCE(:image_url, image_url),
      is_public = COALESCE(:is_public, is_public),
      updated_at = :updated_at
    WHERE id = :id
    RETURNING *;
  `;

  const [result] = await sequelize.query(sql, {
    replacements: {
      id,
      title: updatedRecipe.title ?? null,
      description: updatedRecipe.description ?? null,
      ingredients: ingredientsLiteral,
      instructions: instructionsLiteral,
      cooking_time: updatedRecipe.cooking_time ?? null,
      servings: updatedRecipe.servings ?? null,
      difficulty: updatedRecipe.difficulty ?? null,
      image_url: updatedRecipe.image_url ?? null,
      is_public: updatedRecipe.is_public ?? null,
      updated_at: updatedAt,
    },
  });

  return result[0];
}

async function deleteRecipe(id, userId) {
  let recipe;

  // Fetch the recipe first
  const selectQuery = `
    SELECT * FROM recipes
    WHERE id = :id AND user_id = :userId
  `;

  try {
    const [rows] = await sequelize.query(selectQuery, {
      replacements: { id, userId },
    });

    recipe = rows[0];
    if (!recipe) {
      throw new Error("Recipe not found or does not belong to user");
    }
  } catch (error) {
    throw error;
  }

  const deleteQuery = `
    DELETE FROM recipes
    WHERE id = :id AND user_id = :userId
  `;

  try {
    await sequelize.query(deleteQuery, {
      replacements: { id, userId },
    });
  } catch (error) {
    throw error;
  }

  return recipe; // return the deleted recipe
}

async function getRecipeByQuery(queryObj, userId) {
  let filteredRecipes = [];
  let query = ``;
  for (const key in queryObj) {
    const value = queryObj[key];

    switch (key) {
      case "difficulty":
        console.log("Difficulty:", value);
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.difficulty === value,
        );
        break;

      case "cooking_time":
        const num = Number(value);
        console.log("Max cooking time:", num);
        query = `SELECT *
                  FROM recipes
                  WHERE cooking_time > :time;`;
        [filteredRecipes] = await sequelize.query(query, {
          replacements: { num },
        });
        break;

      case "search":
        console.log("Search term:", value);

        query = `SELECT *
                  FROM recipes
                  WHERE user_id = :userId
                    AND (title ILIKE '%' || :str || '%' 
                      OR description ILIKE '%' || :str || '%');`;
        [filteredRecipes] = await sequelize.query(query, {
          replacements: { userId, str: value },
        });
        break;

      default:
        console.log("Unknown key:", key);
    }
  }
  return filteredRecipes;
}

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeByQuery,
};
