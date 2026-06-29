/*
  Rutas de usuarios / Auth
  host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const router = Router();

router.post(
  '/new',
  [ // middlewares
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contrasenia debe de ser de un minimo de 6 caracteres.').isLength({ min: 6 }),
    fieldValidator,
  ],
  crearUsuario);

router.post(
  '/',
  [ // middlewares
    check('email', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contrasenia debe de ser de un minimo de 6 caracteres.').isLength({ min: 6 }),
    fieldValidator,
  ],
  loginUsuario);

router.get('/renew', jwtValidator, revalidarToken);

module.exports = router;
