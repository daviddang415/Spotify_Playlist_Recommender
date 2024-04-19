import {useState, useEffect} from 'react';

// components
import PlaylistDetails from "../components/PlaylistDetails"
import GeneratedPlaylistDetails from '../components/GeneratedPlaylistDetails';

/*
Login Page:
- Description of project
- Sign In Option

Page Once User Logs In:
- Shows user's playlists
    - Clicking playlist expands playlist to show songs
- Button that allows user to generate playlist
    - Should allow user to have playlist added to their account
-Generating Playlist
  - Uses machine learning to generate playlist
  - Displays playlist and provides option to user if they want to add it to their spotify account
  - Stores generated playlist in mysql database
*/

const Home = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([])
  const [userName, setUserName] = useState("")
  const [userID, setUserID] = useState(null)
  const [currentSong, setCurrentSong] = useState("")
  const [currentPlaylistName, setCurrentPlaylistName] = useState("")
  const [generatedPlaylists, setGeneratedPlaylists] = useState([])
  const [isExpired, setIsExpired] = useState(false)

  const updateToken = async () => {
      console.log("updating access token")
      const refreshToken = window.sessionStorage.getItem(`refresh_token`)
      const response = await fetch(`/refresh_token/${refreshToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }) 

      const json = await response.json()
      
      window.sessionStorage.removeItem(`refresh_token`)
      window.sessionStorage.removeItem(`startTime`)
      setIsExpired(false)

      window.location.replace(json['new_url'])
  }
  
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
      }).catch(err => {console.log(err)})

      const json = await response.json()
      setUserName(json.name)
      setUserID(json.id)
    }

    const addUserToTable = async () => {
      const response = await fetch(`/database/addUser`, {
        method: "POST",
        body: JSON.stringify({userID: userID, spotifyUsername: userName}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      }).catch(err => {console.log(err)});
    }

    const fetchPlaylists = async () => {
      const response = await fetch(`/userData/playlist/${token}/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(err => {console.log(err)})

      const json = await response.json()
      setPlaylists(json.playlists)
    }

    const fetchGeneratedPlaylists = async () => {
      const response = await fetch(`/database/getGeneratedPlaylists/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(err => {console.log(err)})

      const json = await response.json()
      setGeneratedPlaylists(json["generatedPlaylists"])
    }
    
    if (data) {
      const queryParameters = new URLSearchParams(window.location.search)

      const access_token = queryParameters.get("access_token")
      const refresh_token = queryParameters.get("refresh_token")

      if (refresh_token) {
        window.sessionStorage.setItem(`refresh_token`, refresh_token)
      }

      setToken(access_token)
    } else {
      fetchData()
    }

    if (token) {
      fetchUserName()
    }

    if (userID) {
      addUserToTable()
      fetchPlaylists()
    }

    if (userID && generatedPlaylists.length === 0) {
      fetchGeneratedPlaylists(userID)
    }

  if (token) {
    if (window.sessionStorage.getItem(`startTime`)) {
        const duration = Math.floor((window.sessionStorage.getItem(`startTime`) - Date.now()))
        console.log("setting up timer for:", Math.floor(duration/1000), "seconds")
        const timer = setTimeout(() => {
          if (isExpired === false) {
            setIsExpired(true)
            alert("Access token has expired. Please refresh the page.")
            updateToken()
          }
        }, duration)

        return () => clearTimeout(timer)
      } else {
        window.sessionStorage.setItem(`startTime`, Math.floor(Date.now() + 60 * 60 * 1000))
      }

      //console.log("expiration date", Math.floor((window.sessionStorage.getItem(`startTime`) - Date.now())/1000))
    }
  }, [data, userID, token])
  
  
  const logOut = () => {
    window.location.replace("http://localhost:3000/")
    
    setUserName("")
    setUserID(null)
    setData(null)
    setToken(null)

    window.sessionStorage.removeItem(`refresh_token`)
    window.sessionStorage.removeItem(`startTime`)
  }

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

    {/*console.log(generatedPlaylists)*/}

    {token &&
      <div className="container" style={{"marginBottom":"15px"}}>
        <h3 style={{"textAlign": "left", "paddingLeft": "12px", "marginBottom": "15px"}}>Generated Playlists</h3>
        {/*<div className='temp' style={{height: "400px", "overflowY": "auto", "overflowX": "hidden"}}>
          <div className="row row-cols-auto gy-2">
                {playlists && playlists.map((playlist) => (
                      <div className="col"> <PlaylistDetails key={playlist.id} playlist={playlist}/> </div>
                ))}
          </div>
        </div>*/}
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 gy-4">
              {generatedPlaylists.length ? generatedPlaylists.map((generatedPlaylist) => (
                  <div className="col" key={generatedPlaylist['id']}> 
                                                      <GeneratedPlaylistDetails
                                                         userID={userID} 
                                                         playlistID={generatedPlaylist['id']}
                                                         playlistName={generatedPlaylist['name']}
                                                         token={token}
                                                         recSongs={generatedPlaylist['tracks']} 
                                                         currentSong={currentSong} 
                                                         setCurrentSong={setCurrentSong}
                                                         currentPlaylistName={currentPlaylistName}
                                                         setCurrentPlaylistName={setCurrentPlaylistName}
                                                         setGeneratedPlaylists={setGeneratedPlaylists}
                                                         isAdded = {generatedPlaylist['isAdded']}/> 
                  </div>
              )) : <div></div>}
          </div>
      </div>}

      {token &&
      <div className="container" style={{"marginBottom":"15px"}}>
        <h3 style={{"textAlign": "left", "paddingLeft": "12px", "marginBottom": "15px"}}>Your Playlists</h3>
        {/*<div className='temp' style={{height: "400px", "overflowY": "auto", "overflowX": "hidden"}}>
          <div className="row row-cols-auto gy-2">
                {playlists && playlists.map((playlist) => (
                      <div className="col"> <PlaylistDetails key={playlist.id} playlist={playlist}/> </div>
                ))}
          </div>
        </div>*/}
          <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 gy-4">
              {playlists && playlists.map((playlist) => (
                  <div className="col" key={playlist.id}> 
                                                    <PlaylistDetails 
                                                         token={token} 
                                                         playlist={playlist} 
                                                         currentSong={currentSong} 
                                                         setCurrentSong={setCurrentSong}
                                                         generatedPlaylists={generatedPlaylists}
                                                         setGeneratedPlaylists={setGeneratedPlaylists}
                                                         currentPlaylistName={currentPlaylistName}
                                                         setCurrentPlaylistName={setCurrentPlaylistName}/>  
                  </div>
              ))}
          </div>
      </div>}
    </div>
  );
}

export default Home;