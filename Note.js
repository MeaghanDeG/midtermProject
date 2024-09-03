

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        enum: ['deep-blue', 'dark-purple', 'cream'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    },
});

module.exports = mongoose.model('Note', NoteSchema);
