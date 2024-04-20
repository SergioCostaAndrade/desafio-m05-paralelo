const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require('../validacao/s3');
const knex = require('../conexao');

async function deleteObject(params) {
  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
  } catch (error) {
    throw new Error(`Erro ao excluir objeto do S3: ${error.message}`);
  }
}

const excluirProduto = async (req, res) => {
  const { id } = req.params

  try {
    const produtoExistente = await knex('produtos').where('id', id).first()
    if (!produtoExistente) {
      return res.status(404).json({ error: 'Produto não encontrado.' })
    }

    console.log('produto')

     // if (produtoExistente.produto_imagem) {
    //   await s3.deleteObject({
    //     Bucket: process.env.BACKBLAZE_BUCKET,
    //     Key: produtoExistente.produto_imagem
    //   })
    // }

    console.log('apos del')

    await knex('produtos').where('id', id).del()

    return res.status(204).json({ mensagem: 'Produto excluído com sucesso!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

module.exports = excluirProduto
