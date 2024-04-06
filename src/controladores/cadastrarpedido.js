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
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
  try {
    const novoPedido = await knex("pedidos").insert({
      cliente_id,
      observacao,
      valor_total: valorTotalPedido,
    });
    console.log(novoPedido.rowCount);
    if (novoPedido.rowCount < 1) {
      return res.status(400).json({
        mensagem: "Pedido não cadastrado",
      });
    }
    console.log("id do novo pedido", novoPedido.id, novoPedido);
    //
    for (const pedidoproduto of pedido_produtos) {
      try {
        const atualizaEstoque = await knex("produtos")
          .where("id", pedidoproduto.produto_id)
          .update({
            quantidade_estoque:
              quantidade_estoque - pedidoproduto.quantidade_produto,
          });
        const novoPedidoProduto = await knex("pedido_produtos").insert({
          pedido_id: novoPedido.id,
          produto_id: pedidoproduto.produto_id,
          quantidade_produto: pedidoproduto.quantidade_produto,
          valor_produto: atualizaEstoque.valor,
        });
        if (novoPedidoProduto.rowCount < 1) {
          return res.status(400).json({
            mensagem: "Pedido_Produto não cadastrado",
          });
        }
      } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      }
    }
    return res.json(cliente_id, observacao, pedido_produtos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
module.exports = cadastrarPedido;
