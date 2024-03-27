//const knex = require("knex")({
//  client: "pg",
// connection: {
//  host: "localhost",
// user: "postgres",
//password: "123456",
//database: "pdv",
// },
//});
//module.exports = knex;
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  },
});
module.exports = knex;
