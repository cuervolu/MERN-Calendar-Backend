const { response } = require("express");
const Event = require('../models/Event');
const ObjectId = require('mongoose').Types.ObjectId;

const getEvents = async (req, res = response) => {
    const events = await Event.find()
        .populate('user', 'name');
    return res.json({
        ok: true,
        events
    });
}

const createEvent = async (req, res = response) => {
    const event = new Event(req.body);
    try {
        event.user = req.uid;
        const savedEvent = await event.save();

        return res.status(201).json({
            ok: true,
            event: savedEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    //Validar ID proporcionada
    if (!ObjectId.isValid(eventId)) {
        return res.status(400).json({
            ok: false,
            msg: 'La id debe contener 24 caracteres'
        });
    }
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }
    
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este elemento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }
        //Por defecto entrega el evento antiguo
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

        return res.json({
            ok: true,
            event: updatedEvent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    //Validar ID proporcionada
    if (!ObjectId.isValid(eventId)) {
        return res.status(400).json({
            ok: false,
            msg: 'La id debe contener 24 caracteres'
        });
    }
    
    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este elemento'
            })
        }
        //Por defecto entrega el evento antiguo
        await Event.findByIdAndDelete(eventId);

        return res.json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent }