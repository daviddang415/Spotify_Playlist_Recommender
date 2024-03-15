const express = require('express');
const { start, login, callback} = require('../controllers/loginController')

const router = express.Router()

router.get('/start', start)

router.get('/login', login);

router.get('/callback', callback);

module.exports = router