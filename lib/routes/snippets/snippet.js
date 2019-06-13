const mongoose = require('mongoose');
const SnippetSchema = new mongoose.Schema({

    url: {required: true, type: String},
    code: {required: true, type: String},
    stdin: String,
    created_at: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Snippet', SnippetSchema);