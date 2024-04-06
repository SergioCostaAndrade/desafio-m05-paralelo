const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  let valorTotalPedido = 0;
  for (const pedidoproduto of pedido_produtos) {
    try {
      const verificaID = await knex("produtos")
        .where("id", pedidoproduto.produto_id)
        .first();
      valorTotalPedido += pedidoproduto.quantidade_produto * verificaID.valor;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
  console.log(valorTotalPedido);
  return res.json(cliente_id, observacao, pedido_produtos);
};
module.exports = cadastrarPedido;
