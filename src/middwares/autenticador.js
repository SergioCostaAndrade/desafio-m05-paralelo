const knex = require('../conexao')
const jwt = require('jsonwebtoken')
const keyPrivada = process.env.KEY_DEVWEBTOKEN

const usuarioLogado = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      return res.status(401).json({ mensagem: 'Usuário não autorizado.' })
    }
    const token = authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({ mensagem: 'O token deve ser fornecido.' })
    }
    const { id } = jwt.verify(token, keyPrivada)

    const usuario = await knex('usuarios').where({ id }).first()

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não autorizado.' })
    }
    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = usuarioLogado
