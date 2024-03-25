const knex = require("../conexao");

const listarCategorias = async (req, res) => {
  try {
    const listarCategorias = await knex("categorias");
   
    return res.status(200).json(listarCategorias);
  } catch {
    return res.status(500).json({ mensgem: "Erro interno do servidor" });
  }
};
module.exports = listarCategorias;
