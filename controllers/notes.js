const Note = require('../models/note');

exports.createNote = (customUserId, body, callback) => {
    body.userCustomId = customUserId;
    body.createDate = Date();
    body.updateDate = Date();
    let note = new Note(body);
    note.save(callback);
};

exports.getNoteById = (id, callback) => {
    Note.findById(id, callback);
};

exports.getAllNotes = (customUserId, title, content, offset, limit, callback) => {
    let conditions = {};
    if (customUserId) {
        conditions.userCustomId = customUserId;
    }
    if (title) {
        conditions.title = {"$regex": title, "$options": "i"}
    }
    if (content) {
        conditions.content = {"$regex": content, "$options": "i"}
    }
    Note.find(conditions, {}, {skip: offset, limit: limit}, callback);
};

exports.updateNote = (noteId, body, callback) => {
    body.updateDate = Date();
    Note.findByIdAndUpdate(noteId, body, {runValidators: true, context: 'query'}, callback)
};

exports.deleteNoteById = (id, callback) => {
    Note.findByIdAndDelete(id, {}, callback);
};