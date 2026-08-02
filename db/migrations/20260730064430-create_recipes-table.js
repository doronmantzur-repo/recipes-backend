"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recipes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 500],
        },
      },

      ingredients: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      instructions: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      cooking_time: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      servings: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      difficulty: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },

      image_url: {
        type: Sequelize.STRING,
      },

      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("recipes", null, {});
  },
};
