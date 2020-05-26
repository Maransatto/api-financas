const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const transacaoController = require('../../controllers/transacao/transacao-controller');

router.post(
    '/',
    login.required,
    transacaoController.create,
    transacaoController.setCategories,
    transacaoController.returnCreatedTransaction
)

module.exports = router;
