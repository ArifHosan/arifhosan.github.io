const mongoose = require('mongoose');
const SnippetSchema = new mongoose.Schema({

    url: {required: true, type: String},
    code: {required: true, type: String},
    stdin: String,
    language: {
        type : mongoose.Schema.ObjectId,
        ref: 'Language'
    },
    uuid: String,
    created_at: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Snippet', SnippetSchema);