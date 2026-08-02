const { z } = require("zod");

const recipeQuerySchema = z
  .object({
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    cooking_time: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "cooking_time must be a positive number",
      })
      .optional(),
    search: z.string().min(1).optional(),
  })
  .strict();

function validateRecipeQuery(req, res, next) {
  try {
    const result = recipeQuerySchema.safeParse(req.query);
    if (result.success) {
      next();
    } else {
      const error = new Error("Error validating recipe");
      error.status = 404;
      error.message = result.error.issues[0].message;
      next(error);
    }
  } catch (err) {
    const error = new Error("Error validating query");
    error.status = 500;
    next(error);
  }
}

module.exports = validateRecipeQuery;
