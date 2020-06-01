const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const contextController = require('../../controllers/contexto/contexto-controller');
const transactionController = require('../../controllers/transacao/transacao-controller');
const groupController = require('../../controllers/agrupamento/agrupamento-controller');
const categoryController = require('../../controllers/categoria/categoria-controller');
const budgetController = require('../../controllers/orcamento/orcamento-controller');

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
    transactionController.getTransactions,
    transactionController.returnTransactions
)

router.get(
    '/:id_contexto/categorias',
    login.required,
    groupController.getGroups,
    categoryController.getCategories,
    groupController.returnGroups
)

router.get(
    '/:id_contexto/orcamentos',
    login.required,

    // manage new months
    budgetController.createBudgetsForCurrentAndNextMonth,
    budgetController.createBudgetsCategories,

    // gather information
    budgetController.getBudgets,
    groupController.getGroups,
    categoryController.getCategories,
    budgetController.pushGroupsIntoBudgets,
    budgetController.getBudgetValues,
    budgetController.returnBudgets
)

module.exports = router;
