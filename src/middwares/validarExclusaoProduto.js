const knex = require("../conexao");

const validarExclusaoProduto = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            mensagem: "É necessário informar o ID do produto a ser excluído",
        });
    }

    try {
        // Verifica se o produto está vinculado a algum pedido
        const pedidosComProduto = await knex("pedido_produtos")
            .where("produto_id", id)
            .select("pedido_id");

        if (pedidosComProduto.length > 0) {
            return res.status(400).json({
                mensagem: "Não é possível excluir o produto pois está vinculado a um ou mais pedidos.",
            });
        }

        // Se não estiver vinculado a nenhum pedido, permite a exclusão
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = validarExclusaoProduto;