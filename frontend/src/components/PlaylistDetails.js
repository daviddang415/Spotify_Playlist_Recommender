import "./PlaylistDetails.css"
import { useEffect, useState } from "react";
import SongDetails from "./SongDetails";

const PlaylistDetails = ({ token, playlist, currentSong, setCurrentSong }) => {
    const [songs, setSongs] = useState([])

    useEffect(() => {
        const getPlaylistTracks = async (token, playlistID) => {
            const response = await fetch(`/userData/tracks/${token}/${playlistID}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            
            const json = await response.json()
            setSongs(json.songs)
        }
        
        getPlaylistTracks(token, playlist.id)
    }, [token, playlist.id])

    return (
        <div className="container">
            <div className="card border border-secondary" style={{width: '200px', cursor: 'pointer'}}
            data-bs-toggle="modal" data-bs-target={`#details${playlist.id}`} id={`#details${playlist.id}`}>
                {playlist.images.length ? <img className="card-img border-bottom border-black rounded-bottom-0" src={playlist.images[0].url} alt=""/> : <div>No image</div>}
                <div className="card-title">{playlist.name}</div>
            </div>

            <div className="modal fade" id={`details${playlist.id}`}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            {playlist.images.length ? <img className="card-img border border-black rounded" src={playlist.images[0].url} style={{width: '50px', height: '50px'}} alt=""/> : <div>No image</div>}
                            <h3 style={{"marginLeft": "15px"}}>{playlist.name}</h3>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body" style={{"padding": "0px"}}>
                            {/*Song logic*/}
                            <ul className="list-group list-group-flush">
                                {songs && songs.map((song) => (
                                    <li className="list-group-item d-flex justify-content-between border-top border-bottom" style={{padding: "15px"}}>
                                        <SongDetails song={song} currentSong={currentSong} setCurrentSong={setCurrentSong}></SongDetails>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                        <button className="btn btn-primary">Generate Playlist</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaylistDetails;