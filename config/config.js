require("dotenv").config();

let stringPassword = String(process.env.POSTGRES_PASSWORD);
let stringUser = String(process.env.POSTGRES_USER);

let database;

if (process.env.POSTGRES_URL) {
  database = {
    url: `postgres://${stringUser}:${stringPassword}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DATABASE}`,
    host: process.env.POSTGRES_HOST,
    username: stringUser,
    password: stringPassword,
    database: process.env.POSTGRES_DATABASE,
    dialect: process.env.DB_DIALECT,
    secret_key: process.env.SECRET_KEY,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  database = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    secret_key: process.env.SECRET_KEY,
  };
}

module.exports = {
  development: database,

  test: database,

  production: database,
};
