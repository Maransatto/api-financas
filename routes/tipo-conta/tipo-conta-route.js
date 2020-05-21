const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const tipoContaController = require('../../controllers/tipo-conta/tipo-conta-controller');

router.get(
    '/',
    tipoContaController.findAll
)

module.exports = router;