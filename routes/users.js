const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const users = require('../controllers/users');

router.use(bodyParser.json());

router.post("/", (req, res) => {
    users.createUser(req.body, (err, user) => {
        if (err) res.status(400).send(err);
        else res.status(201).send(user)
    })
});

router.patch("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).send({"message": "Patch could not work without id"});
    }
    users.updateUser(id, req.body, (err, user) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(user)
    })
});

router.delete("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        returnres.status(400).send({"message": "Delete could not work without id"});
    }
    users.deleteUserById(id, (err, user) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(user)
    })
});

router.get("/", (req, res) => {
    let query = req.query;
    let page = parseInt(query.page) || 1;
    let perPage = parseInt(query.perPage) || 20;
    users.findAllUsers(
        query.phone,
        query.customId,
        perPage,
        (page - 1) * perPage,
        (err, user) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(user)
    })
});

router.get("/:id", (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).send({"message": "Delete could not work without id"});
    }
    users.findUserById(id, (err, user) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(user)
    })
});

module.exports = router;
