const express = require('express');
const router = express.Router();

const login = require('../../middleware/login.middleware');
const contextController = require('../../controllers/contexto/contexto-controller');

router.post(
    '/',
    login.required,
    contextController.mustNotExists,
    contextController.create,
    contextController.setUserId
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
)
module.exports = router;
