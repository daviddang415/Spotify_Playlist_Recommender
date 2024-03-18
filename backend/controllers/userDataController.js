require('dotenv').config()

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

  const json = await response.json()
  res.json({
    playlists: json.items
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

module.exports = {
    getUsername,
    getPlaylists,
    getTracks
}