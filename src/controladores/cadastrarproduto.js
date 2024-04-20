const knex = require('../conexao');
const s3 = require('../validacao/s3');
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { file } = req;

  if (
    !descricao ||
    !quantidade_estoque ||
    !valor ||
    !categoria_id ||
    quantidade_estoque < 0 ||
    valor < 0
  ) {
    return res.status(400).json({
      error: 'Todos os campos obrigatórios devem ser fornecidos com valores corretos!'
    });
  }

  try {
    const categoriaExistente = await knex('categorias')
      .where('id', categoria_id)
      .first();

    if (!categoriaExistente) {
      return res.status(400).json({ error: 'A categoria informada não existe.' });
    }

    let produto_imagem = null;

    if (file) {
      const arquivo = await s3.send(new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `produtos/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }));

      produto_imagem = `https://${process.env.BACKBLAZE_BUCKET}.s3.amazonaws.com/produtos/${file.originalname}`;
    }

    const novoProduto = await knex('produtos').insert({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem
    });

    const idProduto = novoProduto[0];

    return res.status(201).json({ id: idProduto, mensagem: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = cadastrarProduto;
