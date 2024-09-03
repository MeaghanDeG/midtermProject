
function handleError(res, errorCode, message, statusCode = 500) {
    return res.status(statusCode).json({
        success: false,
        error_code: errorCode,
        message: message
    });
}
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


function noteNotFound(res) {
    return handleError(res, "ERR_NOTE_NOT_FOUND", "Note not found", 404);
}

function validationFailed(res, message = "Validation failed") {
    return handleError(res, "ERR_VALIDATION_FAILED", message, 400);
}

function serverError(res, error) {
    console.error('Server error:', error); // Log the error for debugging
    return handleError(res, "ERR_SERVER_ERROR", "Server error occurred");
}

module.exports = {
    handleError,
    noteNotFound,
    validationFailed,
    serverError
};
