const knex = require("../conexao");
const transportador = require("../email");

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  let valorTotalPedido = 0;
  let indiceArrayQuantidadeProduto = 0;
  let quantidadeProduto = [];
  let valorProduto = [];
  let produtosDoPedido = [];
  for (const pedidoproduto of pedido_produtos) {
    try {
      const verificaID = await knex("produtos")
        .where("id", pedidoproduto.produto_id)
        .first();
      const { quantidade_estoque, valor } = verificaID;
      //
      valorTotalPedido += pedidoproduto.quantidade_produto * valor;
      quantidadeProduto[indiceArrayQuantidadeProduto] = quantidade_estoque;
      valorProduto[indiceArrayQuantidadeProduto] = valor;
      indiceArrayQuantidadeProduto += 1;
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
    if (novoPedido.rowCount < 1) {
      return res.status(400).json({
        mensagem: "Pedido não cadastrado",
      });
    }
    const ultimoPedido = await knex("pedidos").orderBy("id", "desc").limit(1);
    //
    indiceArrayQuantidadeProduto = 0;
    for (const pedidoproduto of pedido_produtos) {
      try {
        let novaQuantidadeEstoque =
          quantidadeProduto[indiceArrayQuantidadeProduto] -
          pedidoproduto.quantidade_produto;
        //
        atualizaEstoque = await knex("produtos")
          .update("quantidade_estoque", novaQuantidadeEstoque)
          .where("id", pedidoproduto.produto_id);
        //
        const novoPedidoProduto = await knex("pedido_produtos").insert({
          pedido_id: ultimoPedido[0].id,
          produto_id: pedidoproduto.produto_id,
          quantidade_produto: pedidoproduto.quantidade_produto,
          valor_produto: valorProduto[indiceArrayQuantidadeProduto],
        });
        indiceArrayQuantidadeProduto += 1;
        if (novoPedidoProduto.rowCount < 1) {
          return res.status(400).json({
            mensagem: "Pedido_Produto não cadastrado",
          });
        }
        const ultimoPedidoProduto = await knex("pedido_produtos")
          .orderBy("id", "desc")
          .limit(1);
        produtosDoPedido.push(ultimoPedidoProduto);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      }
    }
    const apresentaPedido = {
      cliente_id,
      ultimoPedido,
      produtosDoPedido,
    };
    //
    const cliente = await knex("clientes").where("id", cliente_id);
    const texto = "teste de email";
    console.log(`Sr(a) ${cliente[0].nome} você esta recebendo este e-mail como confirmação do \n 
    de seu pedido de compras numero ${ultimoPedido[0].id} \n 
    Valor total do pedido - R$ ${ultimoPedido[0].valor_total} ${texto}`);
    //EMAIL_NAME=Equipe Atrasados e Unidos
    //EMAIL_FROM=scandrade@cubosacademy.com
    //
    transportador.sendMail({
      from: `${"Equipe Atrasados e Unidos"} <${"scandrade@cubosacademy.com"}>`,
      to: `${cliente[0].nome} <${cliente[0].email}>`,
      subject: "Confirmação do seu pedido de compras",
      text: `Sr(a) ${cliente[0].nome} você esta recebendo este e-mail como confirmação do \n 
      de seu pedido de compras numero ${ultimoPedido[0].id} \n 
      Valor total do pedido - R$ ${ultimoPedido[0].valor_total} ${texto}`,
    });
    //
    return res.json(apresentaPedido);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
module.exports = cadastrarPedido;
