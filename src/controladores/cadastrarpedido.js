const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  console.log(cliente_id, observacao, pedido_produtos);
  if (!cliente_id) {
    return res.status(400).json({
      mensagem:
        "Deve ser informado a identificação do cliente para gerar o pedido",
    });
  }
  try {
    const verificaID = await knex("clientes").where("id", cliente_id).first();

    if (!verificaID) {
      return res.status(400).json({ messagem: "Cliente não identificado" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
  if (!pedido_produtos) {
    return res.status(400).json({
      mensagem: "Deve ser informado ao menos um produto para gerar o pedido",
    });
  }
  if (pedido_produtos.length < 1) {
    return res.status(400).json({
      mensagem: "Deve ser informado ao menos um produto para gerar o pedido",
    });
  }
  for (const pedidoproduto of pedido_produtos) {
    try {
      console.log("teste");
      console.log(pedidoproduto.produto_id, pedidoproduto);
      const verificaID = await knex("produtos")
        .where("id", pedidoproduto.produto_id)
        .first();
      console.log(verificaID);
      if (!verificaID) {
        return res.status(400).json({ messagem: "Produto não identificado" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  return res.json(cliente_id, observacao, pedido_produtos);
};
module.exports = cadastrarPedido;
