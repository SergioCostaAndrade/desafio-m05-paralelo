const detalharUsuario = async (req, res) => {
  const { senha, ...usuario } = req.usuario
  return res.status(200).json(usuario)
}

module.exports = detalharUsuario
  