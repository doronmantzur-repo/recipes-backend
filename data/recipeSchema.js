const { z } = require("zod");
// in zod by default additional properties are not allowed
// sending additional properties will failed the middleware
const recipeSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    cooking_time: z.number().positive(),
    servings: z.number().positive(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    rating: z.number().min(0).max(5).optional(),
    image_url: z.string().startsWith("/").optional(),
    is_public: z.boolean().default(true),
  })
  .strict();

module.exports = recipeSchema;
