const knex = require('../conexao');
const s3 = require('../validacao/s3');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Adicionando o DeleteObjectCommand

const editarProduto = async (req, res) => {
  const { id } = req.params;
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
    const produtoExistente = await knex('produtos').where('id', id).first();

    if (!produtoExistente) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (produtoExistente.produto_imagem) {
      const path = produtoExistente.produto_imagem.replace(
        `https://${process.env.BACKBLAZE_BUCKET}.s3.us-east-005.backblazeb2.com/`,
        ''
      );
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: path
      }));
    }

    const categoriaExistente = await knex('categorias').where('id', categoria_id).first();

    if (!categoriaExistente) {
      return res.status(400).json({ error: 'A categoria informada não existe.' });
    }

    let produto_imagem = produtoExistente.produto_imagem;

    if (file) {
      const arquivo = await s3.send(new PutObjectCommand({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `produtos/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }));

      produto_imagem = `https://${process.env.BACKBLAZE_BUCKET}.s3.us-east-005.backblazeb2.com/produtos/${file.originalname}`;
    }

    await knex('produtos').where('id', id).update({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem
    });

    return res.status(204).json({ mensagem: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = editarProduto;
