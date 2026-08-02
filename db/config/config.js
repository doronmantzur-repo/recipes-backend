require("dotenv").config(); // Load .env into process.env

module.exports = {
  development: {
    use_env_variable: "DB_CONNECTION",
    dialect: "postgres",
  },
  test: {
    use_env_variable: "DB_CONNECTION",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DB_CONNECTION",
    dialect: "postgres",
  },
};
