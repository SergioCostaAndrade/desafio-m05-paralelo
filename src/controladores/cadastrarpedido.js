const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  return res.json(cliente_id, observacao, pedido_produtos);
};
module.exports = cadastrarPedido;
