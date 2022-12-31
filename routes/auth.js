/**
    Rutas de Usuarios / Auth
    host + /api/auth/
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { createUser, userLogin, renewToken } = require('../controllers/auth')
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();

router.post(
    '/new',
    [//middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email debe ser válido').isEmail(),
        check('password', 'la contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    createUser);

router.post(
    '/',
    [//middleware
        check('email', 'El email debe ser válido').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    userLogin);

router.get('/renew',validateJWT, renewToken)

module.exports = router;