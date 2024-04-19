require('dotenv').config()
const mysql = require('mysql')

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : process.env.MYSQL_PASSWORD,
    database : 'spotify_generated_playlists'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MYSQL Connected')
});

const addUser = async (req, res) => {
    const { userID, spotifyUsername } = req.body

    let sql = "SELECT * FROM users WHERE id = ?"
    let query = db.query(sql, userID, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            let post2 = {id: userID, username: spotifyUsername}
            let sql2 = 'INSERT INTO users SET ?'
            let query2 = db.query(sql2, post2, (err2, result2) => {
                if (err2) throw err2;
                console.log(result2);
                res.send('Successfully added new user into table')
            })
        } else {
            res.send("No changes to user table are required")
        }
    })
}

const addSong = async (req, res) => {
    const { songID, songPlaylistID, songName, artistName, previewURL, albumURL, songURI} = req.body

    let sql = "SELECT * FROM songs WHERE id = ? AND playlist_id = ?"
    let query = db.query(sql, [songID, songPlaylistID], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            let post2 = {id: songID, 
                         playlist_id: songPlaylistID, 
                         name: songName, 
                         artist_name: artistName, 
                         preview_url: previewURL,
                         image_url: albumURL,
                         uri: songURI}
            let sql2 = 'INSERT INTO songs SET ?'
            let query2 = db.query(sql2, post2, (err2, result2) => {
                if (err2) throw err2;
                console.log(result2);
                res.send('Successfully added song into table')
            })
        } else {
            res.send('No changes maded to songs table')
        }
    })
}

const addPlaylist = async (req, res) => {
    const { playlistID, playlistName, userID, isAdded } = req.body

    let sql = "SELECT * FROM playlists WHERE id = ?"
    let query = db.query(sql, playlistID, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            let post2 = {id: playlistID, name: playlistName, user_id: userID, is_added: isAdded}
            let sql2 = 'INSERT INTO playlists SET ?'
            let query2 = db.query(sql2, post2, (err2, result2) => {
                if (err2) throw err2;
                console.log(result2);
                res.send('Successfully added new playlist into table')
            })
        } else {
            res.send('No changes made to playlists table')
        }
    })
}

const getGeneratedPlaylists = async (req, res) => {
    const { userID } = req.params

    let sql = "SELECT * FROM users WHERE id = ?"
    let user = await new Promise((resolve) => {
        db.query(sql, userID, (err, res) => {
            if (err) throw err;
            resolve(res)
        })
    }).then(res => {
        return res
    });

    if (user.length !== 0) {
        let sql2 = 'SELECT p.id, p.name, p.is_added FROM playlists AS p INNER JOIN (SELECT * FROM users WHERE users.id = ?) AS u ON p.user_id = u.id ORDER BY p.name'
        let playlists = await new Promise((resolve) => {
            db.query(sql2, user[0].id, (err2, res2) => {
                if (err2) throw err2;
                resolve(res2)
            })
        }).then(res2 => {
            return res2
        });

        let sql3 = 'SELECT s.id, s.name, s.artist_name, s.preview_url, s.image_url, s.uri FROM songs AS s INNER JOIN playlists AS p ON s.playlist_id = p.id WHERE p.name = ?'
        let list = []
        for (let i = 0; i < playlists.length; i++) {
            let songList = await new Promise((resolve) => {
                db.query(sql3, playlists[i].name, (err3, res3) => {
                    if (err3) throw err3;
                    let temp = []
                    for (let j = 0; j < res3.length; j++) {
                            temp.push({
                            "id": res3[j].id,
                            "name": res3[j].name, 
                            "artists": [{"name": res3[j].artist_name}],
                            "album": {"images": [{"url": res3[j].image_url}]},
                            "preview_url": res3[j].preview_url,
                            "uri": res3[j].uri})
                    }
                    resolve(temp)
                })
            }).then(res3 => {
                return res3
            });
            list.push({"id": playlists[i].id, "name": playlists[i].name, "tracks": songList, "isAdded": playlists[i].is_added})
        }

        res.json({
            "generatedPlaylists": list
        })
    } else {
        res.json({
            "generatedPlaylists": []
        })
    }
}

const updateTable = async (req, res) => {
    const { playlistID } = req.body

    let sql = "SELECT * FROM playlists WHERE id = ?"
    let query = db.query(sql, playlistID, (err, result) => {
        if (err) throw err;
        if (result.length === 1 && result[0].is_added === 0) {
            let sql2 = 'UPDATE playlists SET is_added = ? WHERE id = ?'
            let query2 = db.query(sql2, [1, playlistID], (err2, result2) => {
                if (err2) throw err2;
                console.log(result2);
                res.send('Successfully update is_added value into table')
            })
        } else {
            res.send('No changes maded to playlists table')
        }
    })
}

const deleteGeneratedPlaylist = (req, res) => {
    const { playlistID } = req.body

    let sql = "DELETE FROM songs WHERE playlist_id = ?"
    let query = db.query(sql, playlistID, (err, result) => {
        if (err) throw err;
    })

    let sql2 = "DELETE FROM playlists WHERE id = ?"
    let query2 = db.query(sql2, playlistID, (err2, result2) => {
        if (err2) throw err2;
    })

    res.send("Playlist was deleted from database")
}


module.exports = {
    addUser,
    addSong,
    addPlaylist,
    getGeneratedPlaylists,
    updateTable,
    deleteGeneratedPlaylist
}