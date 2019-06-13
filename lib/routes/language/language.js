const mongoose = require('mongoose');
const LanguageSchema = new mongoose.Schema({
    title: String,
    file_name: String,
    language_name: String,
    created_at: { type : Date, default: Date.now }
});
module.exports = mongoose.model('Language', LanguageSchema);