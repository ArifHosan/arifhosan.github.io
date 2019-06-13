const express = require('express');
const languageController = express.Router();
const Language = require('./language');
const basicAuth = require('../../../middleware/authenticate');

languageController
    .post('/', basicAuth, async (req, res, next) => {
        const language = await Language.create(req.body);
        res.status(200).send(language)
    });

languageController
    .put('/:id', basicAuth, async (req, res, next) => {
        const language = await Language.findByIdAndUpdate(req.params.id, { $set: req.body }, { $upsert: true, new: true });
        res.status(200).send(language)
    });

languageController
    .get('/', async (req, res, next) => {
        const language = await Language.find();
        res.status(200).send(language)
    });

languageController
    .get('/:id', async (req, res, next) => {
        const language = await Language.findById(req.params.id);
        res.status(200).send(language)
    });

languageController
    .delete('/:id',basicAuth, async (req, res, next) => {
        const language = await Language.deleteOne({ _id: req.params.id });
        res.status(200).send(language)
    });

module.exports = languageController;