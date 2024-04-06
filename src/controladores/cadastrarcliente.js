const knex = require("../conexao");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf } = req.body;

  if (!nome || !email || !cpf) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const emailExistente = await knex("clientes").where("email", email).first();
    if (emailExistente) {
      return res.status(400).json({
        mensagem: "Este e-mail já está sendo usado por outro cliente.",
      });
    }

    const cpfExistente = await knex("clientes").where("cpf", cpf).first();
    if (cpfExistente) {
      return res
        .status(400)
        .json({ mensagem: "Este CPF já está sendo usado por outro cliente." });
    }

    const novoCliente = await knex("clientes").insert(req.body);

    return res
      .status(201)
      .json({ mensagem: "Cliente cadastrado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = cadastrarCliente;