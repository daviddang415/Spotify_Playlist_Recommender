import "./PlaylistDetails.css"
import { useEffect, useState } from "react";
import SongDetails from "./SongDetails";

const PlaylistDetails = ({ token, playlist, currentSong, setCurrentSong, setGeneratedPlaylists, currentPlaylistName, setCurrentPlaylistName}) => {
    const [songs, setSongs] = useState([])
    const [status, setStatus] = useState(0)

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const shortenPlaylistName = (name) => {
        if (name.length < 15) {
            return name
        }
        return name.substring(0, 16) + "..."
    }

    const createGeneratedPlaylist = async (songs) => {
        let trackInfos = []
        for (let i = 0; i < songs.length; i++) {
            const response2 = await fetch(`/userData/trackInfo/${token}/${songs[i]}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            
            const json2 = await response2.json()
            trackInfos.push(json2.trackInfo)
        }

        console.log(trackInfos)
        const id = window.crypto.randomUUID()
        //`Generated Playlist #${list.length + 1}`
        setGeneratedPlaylists(list => [...list, {"id": id, "name": id, "tracks": trackInfos, "isAdded": 0}])
    }

    const generateNewPlaylist = async () => {
        //console.log(songs)
        setStatus(1)
        const response = await fetch(`/recommendPlaylist/recommend`, {
            method: "POST",
            body: JSON.stringify({token: token, playlist_id: playlist.id}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
          }).catch(err => console.log(err));

        const json = await response.json()

        console.log("json", json)
        if (json.songs.length) {
            await createGeneratedPlaylist(json.songs)
            setStatus(2)
        } else {
            setStatus(3)
        }

        await delay(3 * 1000)
        setStatus(0)
    }

    useEffect(() => {
        const getPlaylistTracks = async (token, playlistID) => {
            const response = await fetch(`/userData/tracks/${token}/${playlistID}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }).catch(err => {console.log(err)})
            
            const json = await response.json()
            setSongs(json.songs)
        }
        
        getPlaylistTracks(token, playlist.id)
    }, [token, playlist.id])

    return (
        <div className="container">
            <div className="card border border-secondary" style={{width: '200px', cursor: 'pointer'}}
            data-bs-toggle="modal" data-bs-target={`#details${playlist.id}`} id={`#details${playlist.id}`}>
                {playlist !== null && playlist.images !== null && playlist.images.length > 0 ? <img className="card-img border-bottom border-black rounded-bottom-0" src={playlist.images[0].url} alt=""/> : <div>No image</div>}
                <div className="card-title">{shortenPlaylistName(playlist.name)}</div>
            </div>

            <div className="modal fade" id={`details${playlist.id}`}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            {playlist !== null && playlist.images !== null && playlist.images.length > 0 ? <img className="card-img border border-black rounded" src={playlist.images[0].url} style={{width: '50px', height: '50px'}} alt=""/> : <div>No image</div>}
                            <h3 style={{"marginLeft": "15px"}}>{playlist.name}</h3>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body" style={{"padding": "0px"}}>
                            {/*Song logic*/}
                            <ul className="list-group list-group-flush">
                                {songs && songs.length > 0 ? songs.map((song, i) => (
                                    <li className="list-group-item d-flex justify-content-between border-top border-bottom" key={i} style={{padding: "15px"}}>
                                        <SongDetails
                                                     song={song} 
                                                     currentSong={currentSong} 
                                                     setCurrentSong={setCurrentSong} 
                                                     playlistName={playlist.name}
                                                     currentPlaylistName={currentPlaylistName}
                                                     setCurrentPlaylistName={setCurrentPlaylistName}></SongDetails>
                                    </li>
                                )) : <div className="loadingText">Loading Songs To Playlist</div>}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            {status === 0 ? <button onClick={generateNewPlaylist} className="btn btn-primary">Generate Playlist</button>
                            : status === 1 ? <div className="btn btn-info">Generating Playlist In Progress</div> 
                            : status === 2 ? <div className="btn btn-success">Playlist Generated</div>
                            : <div className="btn btn-danger">Error Generating Playlist</div>
                            }                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaylistDetails;