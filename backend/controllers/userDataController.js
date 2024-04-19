require('dotenv').config()

const makeURIList = (tracks) => {
  let temp = []
  for (const track of tracks) {
    temp.push(track.uri)
  }
  return temp
}

const getData = async (token, songs) => {
  new_arr = []
  for (let i = 0; i < songs.items.length; i++) {
    /*
    new_arr.push({artist_name: songs.items[i].artists[0].name, 
                  artist_image: songs.items[i].album.images[0].url,
                  song_id: songs.items[i].id,
                  song_name: songs.items[i].name,
                  song_previewURL: songs.items[i].preview_url})
    */
    const response = await fetch(`https://api.spotify.com/v1/audio-features/${songs.items[i].id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const json = await response.json()

      new_arr.push(json)
    }
  return new_arr
}

// api calls
const getUsername = async (req, res) => {
    const { token } = req.params
    const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const userData = await response.json()
  res.json({
    name: userData.display_name,
    id: userData.id
  });
}

const getPlaylists = async (req, res) => {
  const { token, userID } = req.params
  const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    return
  }

  const json = await response.json()
  const realList = await new Promise((resolve) => {
    let list = []
    for (let i = 0; i < json.items.length; i++) {
      if (!json.items[i].description.includes("Generated Playlist")) {
        list.push(json.items[i])
      } 
    }
    resolve(list)  
  }).then(res => {
        return res
  });

  res.json({
    playlists: realList
  });
}

const getTracks = async (req, res) => {
  const { token, playlistID } = req.params
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const json = await response.json()
  res.json({
    songs: json.items
  });
}

const getTrackInfo = async (req, res) => {
  const { token, trackID } = req.params
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const json = await response.json()
  //console.log(json)
  res.json({
    trackInfo: json
  });
}

const postPlaylist = async (req, res) => {
  const { userID, tracks, token, name } = req.body
  const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    method: 'POST',
    body: JSON.stringify({"name": name, "public": false, "description": "Generated Playlist"}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  console.log("reponse.ok", response.ok)
  const json = await response.json()
  console.log("json", json)

  const trackURIs = makeURIList(tracks)
  console.log("trackURIs", tracks)

  const response2 = await fetch(`https://api.spotify.com/v1/playlists/${json.id}/tracks`, {
    method: 'POST',
    body: JSON.stringify({uris: trackURIs}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  const json2 = await response2.json()
  console.log("json2", json2)

  res.json({
    result: "Playlist made and songs have been added"
  })
}

module.exports = {
    getUsername,
    getPlaylists,
    getTracks,
    getTrackInfo,
    postPlaylist
}