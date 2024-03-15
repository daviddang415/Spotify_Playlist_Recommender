const express = require('express');
const { getUsername, getPlaylists } = require('../controllers/userDataController')

const router = express.Router()

router.get('/username/:token', getUsername)

router.get('/playlist/:token/:userID', getPlaylists)

module.exports = router