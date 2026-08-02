const recipeModel = require("../models/recipeModel.js");

async function getRecipes(req, res) {
  try {
    const userId = req.user.id;
    const recipes = await recipeModel.getRecipes(userId);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send("Error retrieving recipes  " + error.message);
  }
}

async function getRecipeById(req, res) {
  try {
    const recipe = await recipeModel.getRecipeById(req.params.id);
    if (!recipe) {
      throw {
        ...new Error("Recipe not found"),
        message: "Recipe not found",
        status: 404,
      };
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
}

async function addRecipe(req, res) {
  try {
    const userId = req.user.id;
    const newRecipe = await recipeModel.addRecipe(req.body, userId, req.file? req.file.path: null);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).send("Error adding recipe");
  }
}

async function updateRecipe(req, res) {
  try {
    const userId = req.user.id;
    const updatedRecipe = await recipeModel.updateRecipe(
      req.params.id,
      req.body,
      userId,
    );
    res.status(200).json(updatedRecipe);
  } catch (err) {
    const error = new Error("Recipe not found");
    error.status = 404;
    throw error;
  }
}

async function deleteRecipe(req, res) {
  try {
    const userId = req.user.id;
    const deletedRecipe = await recipeModel.deleteRecipe(req.params.id, userId);
    if (!deletedRecipe) {
      return res.status(404).send("Recipe not found");
    }
    res.status(200).json(deletedRecipe);
  } catch (err) {
    const error = new Error("Recipe not found");
    error.status = 404;
    throw error;
  }
}

async function getRecipesByQuery(req, res) {
  try {
    const userId = req.user.id;
    const queryObj = { ...req.query };
    const recipes = await recipeModel.getRecipeByQuery(queryObj, userId);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send("Error retrieving recipes");
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByQuery,
};
