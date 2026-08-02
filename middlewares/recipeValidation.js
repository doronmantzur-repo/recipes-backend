const recipeSchema = require("../data/recipeSchema.js");

function recipeValidation(req, res, next) {
  try {
    req.body.cooking_time = Number(req.body.cooking_time);
    req.body.servings = Number(req.body.servings);
    if (req.body.is_public === "true") {
      req.body.is_public = true;
    } else if (req.body.is_public === "false") {
      req.body.is_public = false;
    }
    if(req.file) {

      const allowedExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + req.file.originalname.split('.').pop();
      if (!allowedExtensions.includes(fileExtension)) {
        const error = new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed.");
        error.status = 400;
        throw error;
      }

      if (req.file.size > 5 * 1024 * 1024) {
        const error = new Error("File size exceeds the limit of 5MB.");
        error.status = 400;
        throw error;
      }
    }
    const result = recipeSchema.safeParse(req.body);
    if (result.success) {
      next();
    } else {
      const error = new Error("Error validating recipe");
      error.status = 400;
      error.message = result.error.issues[0].message;
      next(error);
    }
  } catch (err) {
    const error = new Error("Error validating recipe");
    error.status = 500;
    error.message = err.message;
    next(error);
  }
}

module.exports = recipeValidation;
