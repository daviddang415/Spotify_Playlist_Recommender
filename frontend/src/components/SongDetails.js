const SongDetails = ({song}) => {
    return (
        <div className="container">
            <div className="d-flex justify-content-start">
                <div>{song.track.album.images.length ? <img className="card-img border border-black rounded" style={{width: '50px', height: '50px'}}  src={song.track.album.images[0].url} alt=""/> : <div>No image</div>}</div>
                    <ul className="list-group list-group-flush" style={{"textAlign": "left", "marginLeft": "15px"}}>
                        <li className="list-group-item" style={{"border": "none", "padding": "0px"}}><div style={{"fontWeight": "bold"}}>{song.track.name}</div></li>
                        <li className="list-group-item" style={{"border": "none", "padding": "0px"}}>{song.track.artists[0].name}</li>
                    </ul>
                </div>
            <div>{console.log(song.track)}</div>
        </div>
    )
}

export default SongDetails;