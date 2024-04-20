const knex = require("../conexao");

const detalharCliente = async (req, res) => {
    const { id } = req.params
    try {
        const verificaID = await knex('clientes').where({ id }).first()

        if (!verificaID) {
            return res.status(404).json({
                messagem: 'Cliente não identificado'
            })


        }
        return res.status(200).json(verificaID);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = detalharCliente