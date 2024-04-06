const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
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
      console.log("aqui", pedidoproduto.produto_id);
      if (!pedidoproduto.produto_id) {
        return res.status(400).json({ messagem: "Produto não informado" });
      }
      const verificaID = await knex("produtos")
        .where("id", pedidoproduto.produto_id)
        .first();
      if (!verificaID) {
        return res.status(400).json({ messagem: "Produto não identificado" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  return res.json(cliente_id, observacao, pedido_produtos);
};
module.exports = cadastrarPedido;
