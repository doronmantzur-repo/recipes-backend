const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },

      instructions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },

      cooking_time: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      servings: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },

      image_url: {
        type: DataTypes.STRING,
      },

      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "recipes",
      timestamps: true,
      underscored: false,
    },
  );

  return Recipe;
};
