const Player = ({ songName, isPlaying, setIsPlaying, currentSong, setCurrentSong, playlistName, currentPlaylistName, setCurrentPlaylistName}) => {
    
    const playPause = () => {
        if (currentSong === songName && playlistName === currentPlaylistName) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentPlaylistName(playlistName)
            setIsPlaying(true)
            setCurrentSong(songName)
       }
    }

    return (
        <div className="container">
            {(isPlaying === true) && (currentSong === songName) ? <svg xmlns="http://www.w3.org/2000/svg" onClick={playPause} style= {{cursor: 'pointer'}} width="32" height="32" fill="currentColor" className="bi bi-pause-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" onClick={playPause} style= {{cursor: 'pointer'}} width="32" height="32" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
            </svg>}
        </div>
    )
} 
export default Player;