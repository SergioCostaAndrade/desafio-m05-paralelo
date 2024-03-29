const knex = require("../conexao");

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;
    let num = 0
    if (categoria_id) {
    num = Number(categoria_id);
    if (!Number.isInteger(num) || num <= 0) {
      return res
        .status(400)
        .json({ mensagem: "Id informado não é inteiro ou é negativo" });
    }
    }
    try {
      if (num > 0) {
        const listarProdutos = await knex("produtos").where({ categoria_id });
        if (listarProdutos.length < 1) {
          return res.status(200).json({ mensagem: "Produtos não encontrados para a Categoria informada" });
        } else {
          return res.status(200).json(listarProdutos);
        }
      } else {
        const listarProdutos = await knex("produtos");
        return res.status(200).json(listarProdutos);
      }
    } catch (error){
      return res.status(500).json({ mensgem: "Erro interno do servidor" });
    }
  };
module.exports = listarProdutos;
