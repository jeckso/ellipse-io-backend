const Note = require('../models/note');

exports.createNote = (customUserId, body, callback) => {
    body.userCustomId = customUserId;
    let note = new Note(body);
    note.createDate = Date();
    note.updateDate = Date();
    note.save(callback);
};

exports.getNoteById = (id, callback) => {
    Note.findById(id, callback);
};

exports.getAllNotes = (customUserId, title, content, offset, limit, callback) => {
    let conditions = {};
    conditions.userCustomId = customUserId;
    if (title) {
        conditions.title = {"$regex": title, "$options": "i"}
    }
    if (content) {
        conditions.content = {"$regex": content, "$options": "i"}
    }
    console.log(JSON.stringify(conditions));
    console.log("LIMIT " + limit + " 0FFSET " + offset);
    Note.find(conditions, {}, {skip: offset, limit: limit}, callback);
};

exports.updateNote = (noteId, body, callback) => {
    body.updateDate = Date();
    Note.findByIdAndUpdate(noteId, body, {runValidators: true, context: 'query'}, callback)
};

exports.deleteNoteById = (id, callback) => {
    Note.findByIdAndDelete(id, {}, callback);
};