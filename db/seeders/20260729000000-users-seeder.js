"use strict";

const fs = require("fs");
const path = require("path");

module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../json/", "users.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
