const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const contaController = require('../../controllers/conta/conta-controller');

router.post(
    '/',
    login.required,
    contaController.mustNotExists,
    contaController.create
)

module.exports = router;