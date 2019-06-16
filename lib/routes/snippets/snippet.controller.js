const express = require('express');
const snippetRouter = express.Router();
const Snippet = require('./snippet');

const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

snippetRouter
    .post('/', async (req, res, next) => {
        req.body.url = generateUrl(8);
        const snippet = await Snippet.create(req.body);
        res.status(200).send(snippet);
    });

snippetRouter
    .put('/:id', async (req, res, next) => {
        const snippet = await Snippet.findOneAndUpdate({_id: req.params.id, uuid: req.body.uuid}, { $set: req.body }, { $upsert: true, new: true });
        res.status(200).send(snippet)
    });

// snippetRouter
//     .get('/', async (req, res, next) => {
//         const snippet = await Snippet.find();
//         res.status(200).send(snippet)
//     });

snippetRouter
    .get('/:id', async (req, res, next) => {
        const snippet = await Snippet.find({url: req.params.id}).populate('language');
        res.status(200).send(snippet)
    });

// snippetRouter
//     .delete('/:id', async (req, res, next) => {
//         const note = await Note.deleteOne({ _id: req.params.id });
//         res.status(200).send(note)
//     });

function generateUrl(length) {
    return Array.from({length:length}, _ => charList[Math.floor(Math.random()*charList.length)]).join('');
}

module.exports = snippetRouter;