const knex = require('../conexao');

const listarCliente = async (req, res) => {
    try {
        const clientes = await knex('clientes').select('*');
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = listarCliente;