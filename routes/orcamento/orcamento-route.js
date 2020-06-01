const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const budgetController = require('../../controllers/orcamento/orcamento-controller');

router.patch(
    '/',
    login.required,
    budgetController.changeBudgetValue
)

module.exports = router;
