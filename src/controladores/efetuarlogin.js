const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const senhaHash = require("../senhaHash");
const efetuarLogin = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(404).json("É obrigatório email e senha");
  }

  try {
    const existeUsuario = await knex("usuarios").where("email", email);

    if (existeUsuario.length === 0) {
      return res.status(400).json("O usuario não foi encontrado");
    }
    const usuario = existeUsuario[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json("Email e senha não confere");
    }
    const token = jwt.sign({ id: usuario.id }, process.env.KEY_DEVWEBTOKEN, {
      expiresIn: "8h",
    });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = efetuarLogin;
