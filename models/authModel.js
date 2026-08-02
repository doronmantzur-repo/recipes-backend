const bcrypt = require("bcrypt");
const { sequelize } = require("../db/models/index.js");
const { v4: uuidv4 } = require("uuid");

const users = [
  {
    id: "11111111-aaaa-4aaa-bbbb-cccccccc0001",
    name: "Doron",
    email: "doron@example.com",
    password: "$2a$10$LTLlTIjGEhq7gjuedyeRluFBe9z8rmOT0.pTtNysprPxCxCK8gIbK",
  },
];

// async function login(email, password) {
//     const user = users.find(u => u.email === email && u.password === password);
//     return user;
// }

async function login(email, password) {
  const query = `SELECT * from users WHERE email = :email`;
  const [user] = await sequelize.query(query, {
    replacements: { email },
  });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) return null;
  const { password: _, ...userNoPassword } = user;
  return userNoPassword;
}

async function register(userData) {
  const query =
    "INSERT INTO users (id, username, email, password, first_name, last_name) VALUES (:id, :username, :email, :password, :first_name, :last_name) RETURNING *;";
  try {
    const [result, metadata] = await sequelize.query(query, {
      replacements: {
        id: uuidv4(),
        username: userData.user_name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    });
    return result[0];
  } catch (error) {
    throw new Error("Error registering user");
  }

  return userNoPassword;
}

async function getProfile(userId) {
  const query = `SELECT * from users WHERE id = :id`;
  const [user] = await sequelize.query(query, {
    replacements: { id: userId },
  });
  if (!user) return null;
  const { password: _, ...userNoPassword } = user[0];
  return userNoPassword;
}

module.exports = { login, register, getProfile };
