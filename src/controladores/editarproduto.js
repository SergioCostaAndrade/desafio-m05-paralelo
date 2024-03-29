const knex = require('../conexao');

const editarProduto = async (req, res) => {
    const {id} = req.params;
    const {descricao, quantidade_estoque, valor, categoria_id} = req.body;

    try {
        const produtoExistente = await knex('produtos').where('id', id).first();
        if (!produtoExistente) {
            return res.status(404).json({error:'Produto não encontrado.'});
        }
        if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
            return res.status(400).json({error:'Todos os campos obrigatórios devem ser fornecidos.'});
        }
        const categoriaExistente = await knex('categorias').where('id', categoria_id).first();
        if (!categoriaExistente) {
            return res.status(400).json({error:'A categoria informada não existe.'});
        }
        await knex('produtos')
            .where('id', id)
            .update({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id
            });

        return res.status(200).json({mensagem:'Produto atualizado com sucesso!'});
    } catch (error) {
        return res.status(500).json({mensgem: "Erro interno do servidor"});
    }
};

module.exports = editarProduto;