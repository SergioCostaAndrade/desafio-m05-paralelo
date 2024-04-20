const knex = require("../conexao");

const detalharProduto = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || id <= 0) {
        return res.status(400).json({ mensagem: "Informe um ID de produto válido." });
    }
    try {
        const produto = await knex("produtos").where({ id }).first();
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }
        return res.status(200).json(produto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = detalharProduto;
