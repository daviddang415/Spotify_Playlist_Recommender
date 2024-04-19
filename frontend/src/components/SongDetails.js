import { useRef, useState, useEffect} from "react";
import Player from "./Player";


const SongDetails = ({song, currentSong, setCurrentSong, playlistName, currentPlaylistName, setCurrentPlaylistName}) => {
    const [isPlaying, setIsPlaying] = useState(false)

    const audioElem = useRef()

    useEffect(() => {
        if (song.track.preview_url) {
            if (isPlaying && currentSong === song.track.name) {
                if (playlistName === currentPlaylistName) {
                    audioElem.current.play()
                } else {
                    setIsPlaying(false)
                    audioElem.current.pause()
                }
            } else {
                audioElem.current.pause()
            }
        }
    }, [isPlaying, currentSong, song.track.name, playlistName, currentPlaylistName, song.track.preview_url])

    return (
        <div className="container d-flex justify-content-between">
            <div className="d-flex justify-content-start">
                <div>{song.track.album !== null && song.track.album.images !== null && song.track.album.images.length > 0 ? <img className="card-img border border-black rounded" style={{width: '50px', height: '50px'}}  src={song.track.album.images[0].url} alt=""/> : <div>No image</div>}</div>
                    <ul className="list-group list-group-flush" style={{"textAlign": "left", "marginLeft": "15px"}}>
                        <li className="list-group-item" style={{"border": "none", "padding": "0px"}}><div style={{"fontWeight": "bold"}}>{song.track.name}</div></li>
                        <li className="list-group-item" style={{"border": "none", "padding": "0px"}}>{song.track.artists[0].name}</li>
                    </ul>
            </div>
            <div className="d-flex flex-column justify-content-center">
                {song.track.preview_url && 
                <div>
                    <audio src={song.track.preview_url} ref={audioElem} onEnded={() => {setIsPlaying(false)}}></audio>
                    <Player songName={song.track.name} 
                            isPlaying={isPlaying} 
                            setIsPlaying={setIsPlaying} 
                            currentSong={currentSong} 
                            setCurrentSong={setCurrentSong}
                            playlistName={playlistName}
                            currentPlaylistName={currentPlaylistName}
                            setCurrentPlaylistName={setCurrentPlaylistName}
                            onClick={() => {console.log(song.track.album.images[0].url)}}>
                    </Player>
                </div>}
            </div>
        </div>
    )
}

export default SongDetails;