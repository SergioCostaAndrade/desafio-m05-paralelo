// const knex = require("../conexao");
// const transportador = require("../email");

// const cadastrarPedido = async (req, res) => {
//   const { cliente_id, observacao, pedido_produtos } = req.body;
//   let valorTotalPedido = 0;
//   let indiceArrayQuantidadeProduto = 0;
//   let quantidadeProduto = [];
//   let valorProduto = [];
//   let descricaoProduto = [];
//   let produtosDoPedido = [];
//   for (const pedidoproduto of pedido_produtos) {
//     try {
//       const verificaID = await knex("produtos")
//         .where("id", pedidoproduto.produto_id)
//         .first();
//       const { quantidade_estoque, valor, descricao } = verificaID;
//       //
//       valorTotalPedido += pedidoproduto.quantidade_produto * valor;
//       quantidadeProduto[indiceArrayQuantidadeProduto] = quantidade_estoque;
//       valorProduto[indiceArrayQuantidadeProduto] = valor;
//       descricaoProduto[indiceArrayQuantidadeProduto] = descricao;
//       indiceArrayQuantidadeProduto += 1;
//     } catch (error) {
//       return res.status(500).json({ mensagem: "Erro interno do servidor" });
//     }
//   }
//   try {
//     const novoPedido = await knex("pedidos")
//       .insert({
//         cliente_id,
//         observacao,
//         valor_total: valorTotalPedido,
//       })
//       .returning("*");
//     if (novoPedido.rowCount < 1) {
//       return res.status(400).json({
//         mensagem: "Pedido não cadastrado",
//       });
//     }
//     console.log(novoPedido);
//     const ultimoPedido = await knex("pedidos").orderBy("id", "desc").limit(1);
//     //
//     indiceArrayQuantidadeProduto = 0;
//     for (const pedidoproduto of pedido_produtos) {
//       try {
//         let novaQuantidadeEstoque =
//           quantidadeProduto[indiceArrayQuantidadeProduto] -
//           pedidoproduto.quantidade_produto;
//         //
//         atualizaEstoque = await knex("produtos")
//           .update("quantidade_estoque", novaQuantidadeEstoque)
//           .where("id", pedidoproduto.produto_id);
//         //
//         const novoPedidoProduto = await knex("pedido_produtos").insert({
//           pedido_id: ultimoPedido[0].id,
//           produto_id: pedidoproduto.produto_id,
//           quantidade_produto: pedidoproduto.quantidade_produto,
//           valor_produto: valorProduto[indiceArrayQuantidadeProduto],
//         });
//         indiceArrayQuantidadeProduto += 1;
//         if (novoPedidoProduto.rowCount < 1) {
//           return res.status(400).json({
//             mensagem: "Pedido_Produto não cadastrado",
//           });
//         }
//         const ultimoPedidoProduto = await knex("pedido_produtos")
//           .orderBy("id", "desc")
//           .limit(1);
//         produtosDoPedido.push(ultimoPedidoProduto);
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({ mensagem: "Erro interno do servidor" });
//       }
//     }
//     const apresentaPedido = {
//       cliente_id,
//       ultimoPedido,
//       produtosDoPedido,
//     };
//     //
//     const cliente = await knex("clientes").where("id", cliente_id);
//     //
//     const texto = "Segue a lista de produtos comprados comprados:";
//     const cabecalho = "Descricao      Quantidade  Valor";
//     let listaDeCompras = "";
//     for (let i = 0; i < descricaoProduto.length; i++) {
//       listaDeCompras =
//         listaDeCompras +
//         descricaoProduto[i] +
//         "   " +
//         pedido_produtos[i].quantidade_produto +
//         "           " +
//         valorProduto[i] +
//         "\r\n" +
//         "            ";
//     }
//     console.log('antes');
//     await transportador.sendMail({
//       from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
//       to: `${cliente[0].nome} <${cliente[0].email}>`,
//       subject: "Confirmação do seu pedido de compras",
//       text: `Sr(a) ${cliente[0].nome} você esta recebendo este e-mail como confirmação do \r\n
//       seu pedido de compras numero ${ultimoPedido[0].id}. \r\n
//       Valor total do pedido - R$ ${ultimoPedido[0].valor_total} \r\n
//        ${texto} \r\n
//        ${cabecalho} \r\n
//       ${listaDeCompras}`,
//     });
//     return res.status(201).json(apresentaPedido);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ mensagem: "Erro interno do servidor" });
//   }
// };
// module.exports = cadastrarPedido;
const knex = require('../conexao')
const transportador = require('../email')

const cadastrarPedido = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body
  let valorTotalPedido = 0
  let indiceArrayQuantidadeProduto = 0
  let quantidadeProduto = []
  let valorProduto = []
  let descricaoProduto = []
  let produtosDoPedido = []
  for (const pedidoproduto of pedido_produtos) {
    try {
      const verificaID = await knex('produtos')
        .where('id', pedidoproduto.produto_id)
        .first()
      const { quantidade_estoque, valor, descricao } = verificaID
      //
      valorTotalPedido += pedidoproduto.quantidade_produto * valor
      quantidadeProduto[indiceArrayQuantidadeProduto] = quantidade_estoque
      valorProduto[indiceArrayQuantidadeProduto] = valor
      descricaoProduto[indiceArrayQuantidadeProduto] = descricao
      indiceArrayQuantidadeProduto += 1
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
  }
  try {
    let novoPedido = await knex('pedidos')
      .insert({
        cliente_id,
        observacao,
        valor_total: valorTotalPedido
      })
      .returning('*')

    if (!novoPedido) {
      return res.status(400).json({
        mensagem: 'Pedido não cadastrado'
      })
    }

    novoPedido = novoPedido[0]

    indiceArrayQuantidadeProduto = 0
    for (const pedidoproduto of pedido_produtos) {
      try {
        let novaQuantidadeEstoque =
          quantidadeProduto[indiceArrayQuantidadeProduto] -
          pedidoproduto.quantidade_produto
        //
        atualizaEstoque = await knex('produtos')
          .update('quantidade_estoque', novaQuantidadeEstoque)
          .where('id', pedidoproduto.produto_id)
        //
        const novoPedidoProduto = await knex('pedido_produtos').insert({
          pedido_id: novoPedido.id,
          produto_id: pedidoproduto.produto_id,
          quantidade_produto: pedidoproduto.quantidade_produto,
          valor_produto: valorProduto[indiceArrayQuantidadeProduto]
        })
        indiceArrayQuantidadeProduto += 1
        if (novoPedidoProduto.rowCount < 1) {
          return res.status(400).json({
            mensagem: 'Pedido_Produto não cadastrado'
          })
        }
        const ultimoPedidoProduto = await knex('pedido_produtos')
          .orderBy('id', 'desc')
          .limit(1)
        produtosDoPedido.push(ultimoPedidoProduto)
      } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
      }
    }

    const apresentaPedido = {
      cliente_id,
      novoPedido,
      produtosDoPedido
    }
    //
    const cliente = await knex('clientes').where('id', cliente_id).first()
    //
    const texto = 'Segue a lista de produtos comprados:'
    const cabecalho = 'Descricao      Quantidade  Valor'
    let listaDeCompras = ''
    for (let i = 0; i < descricaoProduto.length; i++) {
      listaDeCompras =
        listaDeCompras +
        descricaoProduto[i] +
        '   ' +
        pedido_produtos[i].quantidade_produto +
        '           ' +
        valorProduto[i] +
        '\r\n' +
        '          '
    }

    await transportador.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${cliente.nome} <${cliente.email}>`,
      subject: 'Confirmação do seu pedido de compras',
      text: `Sr(a) ${cliente.nome} você esta recebendo este e-mail como confirmação do \r\n
      seu pedido de compras numero ${novoPedido.id}. \r\n
      Valor total do pedido - R$ ${novoPedido.valor_total} \r\n
       ${texto} \r\n
       ${cabecalho} \r\n
      ${listaDeCompras}`
    })

    return res.status(201).json(apresentaPedido)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}
module.exports = cadastrarPedido
