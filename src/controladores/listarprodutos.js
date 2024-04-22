const knex = require("../conexao");
const { id } = require("../validacao/schemaUsuario");

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;
    if (categoria_id) {
        const numCategoria = Number(categoria_id);
        if (!Number.isInteger(numCategoria) || numCategoria <= 0) {
            return res.status(400).json({ mensagem: "O ID da categoria informado não é um número inteiro positivo." });
        }
    }
    try {
        let produtos;
        if (categoria_id) {
            produtos = await knex("produtos").where({ categoria_id })
            .orderBy(id);
        } else {
            produtos = await knex("produtos")
            .orderBy(id);
        }
        if (produtos.length === 0) {
            return res.status(400).json({ mensagem: "Nenhum produto encontrado." });
        }
        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = listarProdutos;
