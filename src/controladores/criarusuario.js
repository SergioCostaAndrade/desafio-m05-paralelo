const knex = require("../conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const emailExistente = await knex("usuarios").where({ email }).first();
    if (emailExistente) {
      return res
        .status(400)
        .json({ mensagem: "Este email já está sendo usado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning("*");

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = cadastrarUsuario;
