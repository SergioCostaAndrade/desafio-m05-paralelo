const knex = require("../conexao");

const detalharProduto = async (req, res) => {
  const { id } = req.params;
  let num = 0
  if (id) {
  num = Number(id);
  if (!Number.isInteger(num) || num <= 0) {
    return res
      .status(400)
      .json({ mensagem: "Id informado não é inteiro ou é negativo" });
  }
  } else {
    return res
    .status(400)
    .json({ mensagem: "Informe o Id do produto"});

  }
  try {
    if (num > 0) {
      const detalharProduto = await knex("produtos").where({ id });
      if (detalharProduto.length < 1) {
        return res.status(200).json({ mensagem: "Produto não encontrado" });
      } else {
        return res.status(200).json(detalharProduto);
      }
    } 
  } catch (error){
    return res.status(500).json({ mensgem: "Erro interno do servidor" });
  }
};
module.exports = detalharProduto;
