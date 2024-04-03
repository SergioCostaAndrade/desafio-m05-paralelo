const express = require("express");
const criarUsuario = require("./controladores/criarusuario");
const listarCategorias = require("./controladores/listarcategorias");
const efetuarLogin = require("./controladores/efetuarlogin");
const editarUsuario = require("./controladores/editarusuario");
const detalharUsuario = require("./controladores/detalharusuario");
const usuarioLogado = require("./middwares/autenticador");
const validarRequisicao = require("./middwares/validarRequisicao");
const schemaUsuario = require("./validacao/schemaUsuario");
const cadastrarProduto = require("./controladores/cadastrarproduto");
const editarProduto = require("./controladores/editarproduto");
const excluirProduto = require("./controladores/excluirproduto");
const listarProdutos = require("./controladores/listarprodutos");
const detalharProduto = require("./controladores/detalharproduto");
const cadastrarCliente = require("./controladores/cadastrarcliente");

const rota = express();

rota.post("/usuario", validarRequisicao(schemaUsuario), criarUsuario);
rota.post("/login", validarRequisicao(schemaUsuario), efetuarLogin);
rota.get("/categoria", listarCategorias);
rota.use(usuarioLogado);
rota.get("/usuario", detalharUsuario);
rota.put("/usuario", editarUsuario);
rota.post("/produto", cadastrarProduto)
rota.put('/produto/:id', editarProduto)
rota.delete('/produto/:id', excluirProduto)
rota.post("/cliente", cadastrarCliente);
rota.get("/produto",listarProdutos)
rota.get("/produto/:id", detalharProduto)
module.exports = rota;
