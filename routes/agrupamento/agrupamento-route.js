const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const agrupamentoController = require('../../controllers/agrupamento/agrupamento-controller');

router.post(
    '/',
    login.required,
    agrupamentoController.create
)

module.exports = router;