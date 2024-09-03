const Note = require('../models/Note');
const { noteNotFound, validationFailed, serverError } = require('./error');

exports.createNote = async (req, res) => {
    const { title, content, tag, timestamp } = req.body;
    if (!title || !content) {
        return validationFailed(res, "Title and content are required.");
    }

    try {
        const newNote = new Note({
            title,
            content,
            tag,
            timestamp: new Date().toISOString(),
        });
        const savedNote = await newNote.save();
        res.status(200).json({ success: true, note: savedNote });
    } catch (error) {
        return serverError(res, error);
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json({ success: true, notes });
    } catch (error) {
        return serverError(res, error);
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return noteNotFound(res);
        }
        res.status(200).json({ success: true, note });
    } catch (error) {
        return serverError(res, error);
    }
};

exports.updateNoteById = async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNote) {
            return noteNotFound(res);
        }
        res.status(200).json({ success: true, note: updatedNote });
    } catch (error) {
        return serverError(res, error);
    }
};

exports.deleteNoteById = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return noteNotFound(res);
        }
        res.status(200).json({ success: true, note: deletedNote });
    } catch (error) {
        return serverError(res, error);
    }
};
