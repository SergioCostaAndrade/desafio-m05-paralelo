const knex = require('../conexao');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
        return res.status(400).json({error:'Todos os campos obrigatórios devem ser fornecidos.'});
    }
    try {
        const categoriaExistente = await knex('categorias').where('id', categoria_id).first();
        if (!categoriaExistente) {
            return res.status(400).json({error:'A categoria informada não existe.'});
        }

        const novoProduto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        });
        return res.status(201).json({mensagem:"Produto cadastrado com sucesso!"});
    } catch (error) {
        return res.status(500).json({mensgem:"Erro interno do servidor"});
    }
};

module.exports = cadastrarProduto ;