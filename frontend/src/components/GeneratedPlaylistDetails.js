import "./PlaylistDetails.css"
import { useEffect, useState } from "react";
import SongDetails from "./SongDetails";

const GeneratedPlaylistDetails = ({ playlistID, 
                                    playlistName,
                                    token, 
                                    recSongs, 
                                    currentSong, 
                                    setCurrentSong, 
                                    userID, 
                                    currentPlaylistName, 
                                    setCurrentPlaylistName, 
                                    setGeneratedPlaylists, 
                                    isAdded}) => {

    const [songs, setSongs] = useState([])
    const [added, setAdded] = useState(false)

    const shortenPlaylistName = (name) => {
        if (name.length < 15) {
            return name
        }
        return name.substring(0, 16) + "..."
    }

    const test = async () => {
        console.log("recSongs", recSongs)
        await fetch('/userData/playlist/makePlaylist', {
            method: 'POST',
            body: JSON.stringify({tracks: recSongs, token: token, userID: userID, name: playlistName}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        await fetch('/database/updateTable', {
            method: 'POST',
            body: JSON.stringify({playlistID: playlistID}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        setAdded(true)
    }

    const deletePlaylist = async () => {
        //console.log(playlistID)
        console.log("testing generated playlist deletion logic");

        await fetch('/database/deletePlaylist', {
            method: 'POST',
            body: JSON.stringify({playlistID: playlistID}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        setGeneratedPlaylists(list => list.filter((hashTable) => {
            return hashTable["id"] !== playlistID
        }))
    }

    useEffect(() => {
        const addPlaylistToDB = async () => {
            console.log("playlistName", playlistName)
            const response = await fetch(`/database/addPlaylist`, {
                method: "POST",
                body: JSON.stringify({playlistID: playlistID, 
                                      playlistName: playlistName, 
                                      userID: userID,
                                      isAdded: 0
                                    }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }

        const addSongToDB = async (song) => {
            /*
                song.track.name
                song.track.artists[0].name
                song.track.preview_url
                song.track.album.images[0].url
            */
           //console.log("song:", song)
            const response = await fetch(`/database/addSong`, {
                method: "POST",
                body: JSON.stringify({songID: song.id,
                                      songPlaylistID: playlistID,
                                      songName: song.name, 
                                      artistName: song.artists[0].name, 
                                      previewURL: song.preview_url,
                                      albumURL: song.album.images[0].url,
                                      songURI: song.uri
                                    }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }

        if (isAdded === 1) {
            setAdded(true)
        }

        for (let i = 0; i < recSongs.length; i++) {
            addSongToDB(recSongs[i])
        }
        
        addPlaylistToDB()

        setSongs(recSongs)
    }, [])

    return (
        <div className="container">
            <div className="card border border-secondary" style={{width: '200px', cursor: 'pointer'}}
            data-bs-toggle="modal" data-bs-target={`#details${playlistID}`} id={`#details${playlistID}`}>
                <img className="card-img border-bottom border-black rounded-bottom-0" 
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/640px-Spotify_App_Logo.svg.png" 
                     alt=""/>
                <div className="card-title">ID: {shortenPlaylistName(playlistName)}</div>
            </div>

            <div className="modal fade" id={`details${playlistID}`}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <img className="card-img border border-black rounded" 
                                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/640px-Spotify_App_Logo.svg.png" 
                                 style={{width: '50px', height: '50px'}} alt=""/>
                            <h3 style={{"marginLeft": "15px"}}>ID: {playlistName}</h3>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body" style={{"padding": "0px"}}>
                            {/*Song logic*/}
                            <ul className="list-group list-group-flush">
                                {songs.length && songs.map((song, i) => (
                                    <li className="list-group-item d-flex justify-content-between border-top border-bottom" key={i} style={{padding: "15px"}}>
                                        <SongDetails
                                                     song={{'track': song}} 
                                                     currentSong={currentSong} 
                                                     setCurrentSong={setCurrentSong}
                                                     playlistName={playlistName}
                                                     currentPlaylistName={currentPlaylistName}
                                                     setCurrentPlaylistName={setCurrentPlaylistName}></SongDetails>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button onClick={deletePlaylist} className="btn btn-primary" data-bs-dismiss="modal">Delete Playlist</button>
                            {!added ? <button onClick={test} className="btn btn-primary">Add to Spotify</button>
                              : <div className="btn btn-success">Playlist Added to Spotify</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneratedPlaylistDetails;