const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const contaController = require('../../controllers/conta/conta-controller');
const transactionController = require('../../controllers/transacao/transacao-controller');

router.post(
    '/',
    login.required,
    contaController.mustNotExists,
    contaController.create
);

router.get(
    '/tipos',
    contaController.getTypes
);

router.get(
    '/:id_conta/transacoes',
    login.required,
    transactionController.getTransactions,
    transactionController.returnTransactions
)

module.exports = router;