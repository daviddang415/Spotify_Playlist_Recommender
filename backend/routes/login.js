require('dotenv').config()

const express = require('express');
const querystring = require('querystring');

const router = express.Router()

const encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }

  router.get('/start', async (req, res) => {
    res.json({
      endpoint: "http://localhost:4000/login"
    });
})

router.get('/login', async (req, res) => {
    const scope =
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;

  console.log('about to redirect to callback function')
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI
    })
  );
});

router.get('/callback', async (req, res) => {
    const body = {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.REDIRECTURI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }
    
      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: encodeFormData(body)
      })
      .then(response => response.json())
      .then(data => {
        const query = querystring.stringify(data);
        res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
      });
});

// router.get('/search', req, res)

module.exports = router