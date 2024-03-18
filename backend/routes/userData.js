const express = require('express');
const { getUsername, getPlaylists, getTracks } = require('../controllers/userDataController')

const router = express.Router()

router.get('/username/:token', getUsername)

router.get('/playlist/:token/:userID', getPlaylists)

router.get('/tracks/:token/:playlistID', getTracks)

module.exports = router