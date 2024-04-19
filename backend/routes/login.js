const express = require('express');
const { start, login, callback, getNewToken} = require('../controllers/loginController')

const router = express.Router()

router.get('/start', start)

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token/:refreshToken', getNewToken);

module.exports = router