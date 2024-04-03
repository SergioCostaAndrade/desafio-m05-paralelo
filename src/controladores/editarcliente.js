const knex = require('../conexao')

const editarCliente = async (req, res) => {
  const { id } = req.params

  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body

  if (!nome || !email || !cpf) {
    return res
      .status(400)
      .json({ mensagem: 'Nome, email e cpf são obrigatórios.' })
  }

  try {
    const verificaID = await knex('clientes').where({ id }).first()

    if (!verificaID) {
      return res.status(400).json({
        messagem: 'Cliente não identificado'
      })
    }

    const verificaEmail = await knex('clientes').where({ email }).first()

    if (verificaEmail) {
      if (verificaEmail.id !== verificaID.id) {
        return res.status(400).json({
          messagem: 'Já existe usuário cadastrado com o e-mail informado.'
        })
      }
    }

    const verificaCPF = await knex('clientes').where({ cpf }).first()

    if (verificaCPF) {
      if (verificaCPF.id !== verificaID.id) {
        return res.status(400).json({
          messagem: 'Já existe usuário cadastrado com o CPF informado.'
        })
      }
    }

    const atualiza = await knex('clientes')
      .update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .where({ id })
      .returning('*')

    return res.status(200).json(atualiza)
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

module.exports = editarCliente
