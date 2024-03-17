import "./PlaylistDetails.css"

const PlaylistDetails = ({ playlist }) => {
    return (
        <div className="container">
            <div className="card border border-secondary" onClick={() => {console.log(playlist.id)}}style={{width: '200px', cursor: 'pointer'}}
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
                        <div className="modal-body">
                            Song #1
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