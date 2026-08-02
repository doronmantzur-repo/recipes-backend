"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../json/", "recipes.json");
    const recipes = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await queryInterface.bulkInsert("recipes", recipes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("recipes", null, {});
  },
};
