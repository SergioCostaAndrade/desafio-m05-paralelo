const knex = require("../conexao");

const listarCategorias = async (req, res) => {
  const { id } = req.query;
  let num = 0
  if (id) {
  num = Number(id);
  if (!Number.isInteger(num) || num <= 0) {
    return res
      .status(400)
      .json({ mensagem: "Id informado não é inteiro ou é negativo" });
  }
  }
  try {
    if (num > 0) {
      const listarCategorias = await knex("categorias").where({ id });
      if (listarCategorias.length < 1) {
        return res.status(200).json({ mensagem: "Categoria não encontrada" });
      } else {
        return res.status(200).json(listarCategorias);
      }
    } else {
      const listarCategorias = await knex("categorias");
      return res.status(200).json(listarCategorias);
    }
  } catch {
    return res.status(500).json({ mensgem: "Erro interno do servidor" });
  }
};
module.exports = listarCategorias;
