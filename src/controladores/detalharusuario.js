const detalharUsuario = async (req, res) => {
  
   const {senha, ...usuario } = req.usuario 
    res.json(usuario)
  }
  
  module.exports = detalharUsuario
  