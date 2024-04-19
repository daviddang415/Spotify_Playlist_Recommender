const express = require('express');
const { addUser, addSong, addPlaylist, getGeneratedPlaylists, updateTable, deleteGeneratedPlaylist } = require('../controllers/databaseController.js')

const router = express.Router()

router.post('/addUser', addUser)

router.post('/addSong', addSong)

router.post('/addPlaylist', addPlaylist)

router.get('/getGeneratedPlaylists/:userID', getGeneratedPlaylists)

router.post('/updateTable', updateTable)

router.post('/deletePlaylist', deleteGeneratedPlaylist)

module.exports = router