require('dotenv').config()
const { PythonShell } = require('python-shell')

const recommendPlaylist = async (req, res) => {
    const { token, playlist_id } = req.body

    let pyshell = new PythonShell('../backend/data_prep.py', { mode:'text' });
    
    console.log('Testing start:')
    console.log('playlist_id:', playlist_id)
    
    let myPromise = new Promise((reject, resolve) => {
    let recommendedSongs = []
    pyshell.send(JSON.stringify({"playlist_id": playlist_id, 'token': token}));

    pyshell.on('message', function (message) {
        recommendedSongs = JSON.parse(message)
    });

    pyshell.end(function (err) {
        if (err){
            console.log("error", err)
            reject(err);
        };

        console.log('obtained recommended songs', recommendedSongs);
        resolve(recommendedSongs)
    });
  })

  myPromise.then(
    function(value) { res.json({ songs: value});},
    function(error) { res.json({ songs: error});}
  )
}

module.exports = {
    recommendPlaylist
}