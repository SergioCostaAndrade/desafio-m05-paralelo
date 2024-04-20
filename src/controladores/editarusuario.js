const knex = require('../conexao')
const bcrypt = require('bcrypt')

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: 'Nome, email e senha são obrigatórios.' })
  }

  try {
    const verificaEmail = await knex('usuarios').where({ email }).first()

    if (verificaEmail) {
      if (verificaEmail.id !== req.usuario.id) {
        return res.status(400).json({
          messagem: 'Já existe usuário cadastrado com o e-mail informado.'
        })
      }
    }

    const senhaBcrypt = await bcrypt.hash(senha, 10)

    const resultado = await knex('usuarios')
      .update({ nome, email, senha: senhaBcrypt })
      .where('id', req.usuario.id)
      .returning('*')

    return res.status(200).json(resultado)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

module.exports = editarUsuario
