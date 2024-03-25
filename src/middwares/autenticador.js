const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const keyPrivada = process.env.KEY_DEVWEBTOKEN


const usuarioLogado = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ Mensagem: 'Usuário não autorizado.' });
    };

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ Mensagem: 'A senha deve ser fornecida.' })
    };

    try {
        const { id } = jwt.verify(token, keyPrivada);

        const { rows, rowCount } = await knex.query('usuarios').where({id: id}).first().debug();

        if (rowCount < 1) {
            return res.status(401).json({ Mensagem: 'Usuário não autorizado' })
        };

        req.usuario = rows[0];

        next()


    } catch (error) {
        console.log(error)
        return res.status(500).json({ Mensagem: 'Erro interno do servidor' })
    }
}

module.exports = usuarioLogado;
