const express = require('express');
const router = express.Router();
const notes = require('./notes/notes.controller');
const languages = require('./language/language.controller');
const snippets = require('./snippets/snippet.controller');
router.use('/notes', notes);
router.use('/languages', languages);
router.use('/snippets', snippets);
// Add more routes here if you want!
module.exports = router;