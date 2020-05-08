const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const usuarioController = require('../../controllers/usuario/usuario-controller');

router.post('/', usuarioController.mustNotExists, usuarioController.create);
router.post('/login', usuarioController.mustExists, usuarioController.login);

router.get('/', login.required, usuarioController.findAll);

module.exports = router;
