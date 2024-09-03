const Note = require('../models/Note');
const CalendarEvent = require('../models/CalendarEvent'); // Assuming you have a CalendarEvent model
const { noteNotFound, validationFailed, serverError } = require('./error');

exports.createNote = async (req, res) => {
    const { title, content, tag, timestamp, saveToCalendar, calendarDate } = req.body;

    if (!title || !content) {
        return validationFailed(res, "Title and content are required.");
    }

    try {
        const newNote = new Note({
            title,
            content,
            tag,
            timestamp: timestamp || new Date().toISOString(),
        });

        const savedNote = await newNote.save();

        if (saveToCalendar && calendarDate) {
            const newEvent = new CalendarEvent({
                title: title,
                content: content,
                date: calendarDate,
                noteId: savedNote._id // Associate the event with the note
            });
            await newEvent.save();
        }

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
        await CalendarEvent.deleteMany({ noteId: req.params.id }); // Delete associated calendar events
        res.status(200).json({ success: true, note: deletedNote });
    } catch (error) {
        return serverError(res, error);
    }
};
