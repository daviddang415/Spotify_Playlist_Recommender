const express = require('express');
const { getUsername, getPlaylists, getTracks, getTrackInfo, postPlaylist } = require('../controllers/userDataController')

const router = express.Router()

router.get('/username/:token', getUsername)

router.get('/playlist/:token/:userID', getPlaylists)

router.get('/tracks/:token/:playlistID', getTracks)

router.get('/trackInfo/:token/:trackID', getTrackInfo)

router.post('/playlist/makePlaylist', postPlaylist)

module.exports = router