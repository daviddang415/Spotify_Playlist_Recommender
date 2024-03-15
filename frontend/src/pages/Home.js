import {useState, useEffect} from 'react';

// components
import PlaylistDetails from "../components/PlaylistDetails"

/*
Home Page
- Description of project
- Sign In Option
- Shows user's playlists
    - Clicking playlist expands playlist to show songs
- Button that allows to generate playlist
    - Should allow user to have playlist added to their account
*/

const Home = () => {
  const [data, setData] = useState("");
  const [token, setToken] = useState("");
  //const [searchKey, setSearchKey] = useState("")
  //const [artists, setArtists] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [userName, setUserName] = useState("")
  const [userID, setUserID] = useState("")
  
    useEffect(() => {
      const fetchData = async () => {
        await fetch('/start')
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => console.error(error))
      }

      const fetchUserName = async () => {
        const response = await fetch(`/userData/username/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const json = await response.json()
        setUserName(json.name)
        setUserID(json.id)
      }

      const fetchPlaylists = async () => {
        const response = await fetch(`/userData/playlist/${token}/${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const json = await response.json()
        setPlaylists(json.playlists)
      }
      
      if (data) {
        const queryParameters = new URLSearchParams(window.location.search)
        const access_token = queryParameters.get("access_token")
        let token = window.localStorage.getItem("token")
  
        if (!token && access_token) {
          window.localStorage.setItem("token", access_token)
        }
  
        setToken(access_token)
        //console.log(access_token)
      } else {
        fetchData()
      }

      if (token) {
        fetchUserName()
      }

      if (userID) {
        fetchPlaylists()
      }
    }, [data, token, userID])
  
  const logOut = () => {
    setToken("")
    window.localStorage.removeItem("token")
    window.location.replace("http://localhost:3000")
  }

  /*
  const searchArtists = async (e) => {
    e.preventDefault()
    // console.log(searchKey)
    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchKey}&type=artist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const artistData = await response.json()
    //console.log(artistData.artists.items)
    setArtists(artistData.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No image</div>}
        {artist.name}
      </div>
    ))
  }
  */
 
  return (
    <div className="Home">
      <h1>Spotify Playlist Generator</h1>

      {userName ? <div>{`Hello ${userName}`}</div> : <div></div>}

      {!token ? <h2>A website that helps you explore new songs using your music tastes!</h2> : <div></div>}

      {!token ?
      <a href={data ? `${data.endpoint}`: ""}>
        <button>Login to Spotify</button>
      </a> : <button onClick={logOut}>Logout</button>
      }

      {token ?
      <div className="Playlist-Container">
        <h3>Your Playlists</h3>
        <div className="playlists">
                {playlists && playlists.map((playlist) => (
                    <PlaylistDetails key={playlist.id} playlist={playlist}/>
                ))}
        </div>
      </div> 
      : 
      <div></div>}
    </div>
  );
}

export default Home;