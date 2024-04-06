const knex = require("../conexao");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  if (!cliente_id) {
    return res.status(400).json({
      mensagem:
        "Deve ser informado a identificação do cliente para gerar o pedido",
    });
  }
  let num = 0;
  num = Number(cliente_id);
  if (!Number.isInteger(num) || num <= 0) {
    return res
      .status(400)
      .json({ mensagem: "Id informado não é inteiro ou é negativo" });
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
      num = 0;
      num = Number(pedidoproduto.produto_id);
      if (!Number.isInteger(num) || num <= 0) {
        return res.status(400).json({
          mensagem: "Id do produto informado não é inteiro ou é negativo",
        });
      }
      if (!pedidoproduto.quantidade_produto) {
        return res
          .status(400)
          .json({ messagem: "Quantidade do produto deve ser informada" });
      }
      num = 0;
      num = Number(pedidoproduto.quantidade_produto);
      if (!Number.isInteger(num) || num <= 0) {
        return res.status(400).json({
          mensagem:
            "Quantidade do produto informada não é inteiro ou é negativo",
        });
      }
      const verificaID = await knex("produtos")
        .where("id", pedidoproduto.produto_id)
        .first();
      if (!verificaID) {
        return res.status(400).json({ messagem: "Produto não identificado" });
      }
      console.log(verificaID);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  return res.json(cliente_id, observacao, pedido_produtos);
};
module.exports = cadastrarPedido;
