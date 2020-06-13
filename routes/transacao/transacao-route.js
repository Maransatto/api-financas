const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const transacaoController = require('../../controllers/transacao/transacao-controller');
const contatoController = require('../../controllers/contato/contato-controller');

router.post(
    '/',
    login.required,
    contatoController.findByName,
    contatoController.create,
    transacaoController.create,
    transacaoController.removeCategories,
    transacaoController.setCategories,
    transacaoController.returnCreatedTransaction
)

router.patch(
    '/:id_transacao',
    login.required,
    contatoController.findByName,
    contatoController.create,
    transacaoController.update,
    transacaoController.removeCategories,
    transacaoController.setCategories,
    transacaoController.returnCreatedTransaction
)

module.exports = router;
