const knex = require("../conexao");

const listarPedidos = async (req, res) => {
  try {
    let query = knex("pedidos as pedido")
      .select(
        "pedido.id as pedido_id",
        "pedido.valor_total",
        "pedido.observacao",
        "pedido.cliente_id",
        "pedido_produto.id as produto_id",
        "pedido_produto.quantidade_produto",
        "pedido_produto.valor_produto"
      )
      .leftJoin(
        "pedido_produtos as pedido_produto",
        "pedido.id",
        "pedido_produto.pedido_id"
      )
      .groupBy("pedido.id", "pedido_produto.id")
      .orderBy("pedido.id");

    const { cliente_id } = req.query;

    if (cliente_id) {
      const clienteExistente = await knex("clientes")
        .where({ id: cliente_id })
        .first();

      if (!clienteExistente) {
        return res.status(404).json({ mensagem: "Cliente não encontrado." });
      }

      query.where("pedido.cliente_id", cliente_id);
    }

    const pedidos = await query;

    if (pedidos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum pedido encontrado." });
    }

    const listaDePedidos = pedidos.map((pedido) => {
      return {
        pedido: {
          id: pedido.pedido_id,
          valor_total: pedido.valor_total,
          observacao: pedido.observacao,
          cliente_id: pedido.cliente_id,
        },
        pedido_produtos: pedidos
          .filter((item) => item.pedido_id === pedido.pedido_id)
          .map((item) => {
            return {
              id: item.produto_id,
              quantidade_produto: item.quantidade_produto,
              valor_produto: item.valor_produto,
              pedido_id: item.pedido_id,
            };
          }),
      };
    });

    return res.status(200).json(listaDePedidos);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = listarPedidos;
