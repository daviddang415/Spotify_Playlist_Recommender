import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [data, setData] = useState("");
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [userName, setUserName] = useState("")
  
    useEffect(() => {
      const fetchData = async () => {
        await fetch('/start')
        .then(response => response.json())
        .then(json => setData(json))
        .catch(error => console.error(error))
      }

      const fetchUserName = async () => {
        const response = await fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
    
        const userData = await response.json()
        setUserName(userData.display_name)
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
    }, [data])
  
  const logOut = () => {
    setToken("")
    window.localStorage.removeItem("token")
    window.location.replace("http://localhost:3000")
  }

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

  return (
    <div className="App">
      <h1>Spotify React</h1>
      {!token ?
      <a href={data ? `${data.endpoint}`: ""}>
        <button>Login to Spotify</button>
      </a> : <button onClick={logOut}>Logout</button>
      }

      {userName ? <div>{`Hello ${userName}`}</div> : <div></div>}

      {token ? <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
        <button type={"submit"}>Search</button>
      </form> : <h2>Please login</h2>}

      {renderArtists()}
    </div>
  );
}

export default App;
