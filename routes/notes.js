const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const notes = require('../controllers/notes');
const auth = require('../controllers/auth');

router.use(bodyParser.json());

router.post("/", (req, res) => {
    notes.createNote(auth.receivePayload(req).customId, req.body, (err, note) => {
        if (err) res.status(400).send(err);
        else res.status(201).send(note);
    })
});

router.patch("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).send({"message": "Patch could not work without id"});
    }
    if (req.body.customId) {
        return res.status(400).send({"message": "Only admin can change id of user"});
    }
    notes.updateNote(id, req.body, (err, note) => {
        if (err) {
            res.status(500).send(err);
        } else if (note) {
            res.status(200).send(note);
        } else  {
            res.status(404).send({ "message": "Not found" });
        }
    })
});

router.delete("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        res.status(400).send({"message": "Delete could not work without id"});
    }
    notes.deleteNoteById(id, (err, note) => {
        if (err) {
            res.status(500).send(err);
        } else if (note) {
            res.status(200).send(note);
        } else  {
            res.status(404).send({ "message": "Not found" });
        }
    })
});

router.get("/", (req, res) => {
    let query = req.query;
    if (query.customUserId) {
        return res.status(403).send({ 'message': 'Only admin can provide customId' })
    }
    let page = parseInt(query.page) || 1;
    let perPage = parseInt(query.perPage) || 20;

    notes.getAllNotes(
        auth.receivePayload(req).customId,
        query.title,
        query.content,
        (page - 1) * perPage,
        perPage,
        (err, note) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(note);
        })
});

router.get("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        res.status(400).send({"message": "Delete could not work without id"});
    }
    notes.getNoteById(id, (err, note) => {
        if (err) {
            res.status(500).send(err);
        } else if (note) {
            res.status(200).send(note);
        } else  {
            res.status(404).send({ "message": "Not found" });
        }
    })
});

module.exports = router;
