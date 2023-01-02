/**
    Rutas de Eventos / Events
    host + /api/Events/
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');

const router = Router();

//*Todas tienen que pasar por la validación de JWT
router.use(validateJWT);

//Obtener eventos
router.get('/', getEvents);

//Crear evento
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').isISO8601().toDate(),
        check('end', 'Fecha de finalización es obligatoria').isISO8601().toDate(),
        check('end').isISO8601().toDate().custom(( end, { req } ) => end >= req.body.start ).withMessage
        ('Fechas invalidas'),
        fieldsValidator
    ],
    createEvent);

//Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').isISO8601().toDate(),
        check('end', 'Fecha de finalización es obligatoria').isISO8601().toDate(),
        check('end').isISO8601().toDate().custom(( end, { req } ) => end >= req.body.start ).withMessage('Fechas invalidas'),
        fieldsValidator
    ],
    updateEvent);

//Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router;