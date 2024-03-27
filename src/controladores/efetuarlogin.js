const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keyPrivada = process.env.KEY_DEVWEBTOKEN;

const efetuarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'É obrigatório fornecer email e senha' });
    }

    const usuario = await knex('usuarios').where({ email }).first();

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email incorreto ou inexistente' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.id }, keyPrivada, { expiresIn: '1h' });

    const dadosUsuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, };

    res.json({ dadosUsuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = efetuarLogin;
