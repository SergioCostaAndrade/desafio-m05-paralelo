const express = require("express");
const criarUsuario = require("./controladores/criarusuario");
const listarCategorias = require("./controladores/listarcategorias");
const efetuarLogin = require("./controladores/efetuarlogin");
const editarUsuario = require("./controladores/editarusuario");
const detalharUsuario = require("./controladores/detalharusuario");
const usuarioLogado = require("./middwares/autenticador");
const validarRequisicao = require("./middwares/validarRequisicao");
const schemaUsuario = require("./validacao/schemaUsuario");

const rota = express();

rota.post("/usuario", validarRequisicao(schemaUsuario), criarUsuario);
rota.post("/login", efetuarLogin);
rota.get("/categoria", listarCategorias);
rota.use(usuarioLogado);
rota.get("/usuario", detalharUsuario);
rota.put("/usuario", editarUsuario);

module.exports = rota;
