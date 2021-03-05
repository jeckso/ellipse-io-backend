const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const notes = require('../controllers/notes');
const users = require('./users');

router.use(bodyParser.json());

router.get('/notes', (req, res) => {
    let query = req.query
    let page = parseInt(query.page) || 0;
    let perPage = parseInt(query.perPage) || 20;
    notes.getAllNotes(
        query.customUserId,
        query.title,
        query.content,
        perPage,
        (page - 1) * perPage,
        (err, notes) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(notes)
        }
     )
});

router.use('/users', users)

module.exports = router;
