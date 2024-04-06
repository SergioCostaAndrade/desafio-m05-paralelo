const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  console.log(cliente_id, observacao, pedido_produtos);

  return res.json("cadastrar pedido");
};
module.exports = cadastrarPedido;
