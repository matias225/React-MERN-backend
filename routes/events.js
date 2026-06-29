/*
  Events Routes
  /api/events
*/

const { Router } = require('express');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { fieldValidator } = require('../middlewares/field-validator');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const router = Router();

// Tienen que ser validadas por el JWT
router.use(jwtValidator);

// Obtener eventos
router.get('/', getEvents);

// Crear evento
router.post('/:id',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de fin es obligatorio').custom(isDate),
    fieldValidator
  ],
  createEvent);

// Actualizar  evento
router.put('/:id',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de fin es obligatorio').custom(isDate),
    fieldValidator
  ],
  updateEvent);

// Eliminar  evento
router.delete('/:id', deleteEvent);

module.exports = router;