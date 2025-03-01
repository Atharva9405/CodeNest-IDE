const express = require('express');
const router = express.Router();
const validateInput = require('../middleware/validateInput');
const { compiler } = require('../controller/complier');

router.get('/', (req, res) => {
    res.send('Welcome to the online compiler! We are testing and almost done.');
});

router.post('/execute', validateInput, compiler);

module.exports = router;