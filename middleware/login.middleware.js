const jwt = require('jsonwebtoken');
const utils = require("../utils");

const api_config = utils.getApiConfig();

exports.optional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const usuario_decodificado = jwt.verify(token, api_config.jwt_key);
    res.locals.usuario = usuario_decodificado;
  } catch (error) {
    utils.getError(error)
  }
  next();
};

exports.required = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const usuario_decodificado = jwt.verify(token, api_config.jwt_key);
    res.locals.id_usuario = usuario_decodificado.id_usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Usuário não autenticado.'
    });
  }
};