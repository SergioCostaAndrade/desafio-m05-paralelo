const knex = require('../conexao');

const excluirProduto = async (req, res) => {
    const {id} = req.params;

    try {
        const produtoExistente = await knex('produtos').where('id', id).first();
        if (!produtoExistente) {
            return res.status(404).json({error:'Produto não encontrado.'});
        }
        await knex('produtos').where('id', id).del();

        return res.status(200).json({mensagem:'Produto excluído com sucesso!'});
    } catch (error) {
        return res.status(500).json({mensgem: "Erro interno do servidor"});
    }
};

module.exports = excluirProduto;