require("dotenv").config();
const express = require("express");
const rota = require("./rotas");

const app = express();

app.use(express.json());

app.use(rota);

app.listen(process.env.HOST_PORT);