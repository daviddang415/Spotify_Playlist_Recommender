const express = require('express');
const { recommendPlaylist } = require('../controllers/recommendPlaylistController')

const router = express.Router()

router.post('/recommend', recommendPlaylist)

module.exports = router