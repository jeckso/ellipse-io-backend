const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const healthParams = require('../controllers/health_params');
const auth = require('../controllers/auth');

router.use(bodyParser.json());

router.post("/", (req, res) => {
    healthParams.createParameter(auth.receivePayload(req).customId, req.body.heartRate, (err, note) => {
        if (err) res.status(400).send(err);
        else res.status(201).send(note);
    });
});

module.exports = router;