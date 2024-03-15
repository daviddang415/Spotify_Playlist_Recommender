const PlaylistDetails = ({ playlist }) => {
    return (
        <div className="playlist-details">
            {playlist.images.length ? <img width={"50%"} src={playlist.images[0].url} alt=""/> : <div>No image</div>}
            {playlist.name}
        </div>
    )
}

export default PlaylistDetails;