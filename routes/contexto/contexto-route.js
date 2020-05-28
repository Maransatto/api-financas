const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const contextController = require('../../controllers/contexto/contexto-controller');
const transactionController = require('../../controllers/transacao/transacao-controller');
const groupController = require('../../controllers/agrupamento/agrupamento-controller');
const categoryController = require('../../controllers/categoria/categoria-controller');

router.post(
    '/',
    login.required,
    contextController.mustNotExists,
    contextController.create,
    contextController.setUserId,
    contextController.returnCreatedContext
);

router.get(
    '/',
    login.required,
    contextController.findAllUserContexts
);

router.delete(
    '/:id_contexto',
    login.required,
    contextController.mustBeFromLoggedUser,
    contextController.delete
);

router.get(
    '/:id_contexto/contas',
    login.required,
    contextController.getAccounts
);

router.get(
    '/:id_contexto/transacoes',
    login.required,
    transactionController.getTransactions
)

router.get(
    '/:id_contexto/categorias',
    groupController.findByContext,
    categoryController.findByContext
)

module.exports = router;
