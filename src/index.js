require("dotenv").config();
const express = require("express");
const rota = require("./rotas");
const cors = require("cors");

const app = express();

app.use(cors())

app.use(express.json());

app.use(rota);

console.log(process.env.HOST_PORT,
    process.env.KEY_DEVWEBTOKEN,
    process.env.DB_HOST,
    process.env.DB_PORT,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_NAME,
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS,
    process.env.EMAIL_NAME,
    process.env.EMAIL_FROM, 'index');
app.listen(process.env.HOST_PORT);