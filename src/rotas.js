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
const editarCliente = require("./controladores/editarcliente");
const listarClientes = require("./controladores/listarclientes");
const detalharCliente = require("./controladores/detalharcliente");
const cadastrarPedido = require("./controladores/cadastrarpedido");
const validarPedido = require("./middwares/validarPedido");
const listarPedidos = require("./controladores/listarpedidos");
const validarExclusaoProduto = require("./middwares/validarExclusaoProduto");

const rota = express();

rota.post("/usuario", validarRequisicao(schemaUsuario), criarUsuario);
rota.post("/login", validarRequisicao(schemaUsuario), efetuarLogin);
rota.get("/categoria", listarCategorias);
rota.use(usuarioLogado);
rota.get("/usuario", detalharUsuario);
rota.put("/usuario", editarUsuario);
rota.post("/produto", cadastrarProduto);
rota.put("/produto/:id", editarProduto);
rota.delete("/produto/:id", validarExclusaoProduto, excluirProduto);
rota.post("/cliente", cadastrarCliente);
rota.get("/cliente", listarClientes);
rota.get("/produto", listarProdutos);
rota.get("/produto/:id", detalharProduto);
rota.put("/cliente/:id", editarCliente);
rota.get("/cliente/:id", detalharCliente);
rota.post("/pedido", validarPedido, cadastrarPedido);
rota.get("/pedido", listarPedidos);
module.exports = rota;
