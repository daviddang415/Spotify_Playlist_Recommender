require('dotenv').config()
const querystring = require('querystring');

// helper function
const encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}

// api calls
const start = async (req, res) => {
    res.json({
      endpoint: process.env.SERVER_URI + "/login"
    });
}

const login = async (req, res) => {
    const scope =
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-read-collaborative
    playlist-modify-public
    playlist-modify-private`;

  // console.log('about to redirect to callback function')
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI
    })
  );
}

/*
data: {
  access_token: 'BQBha_oTrpSzqfFvNGxPdlB5i35y8G2qfNvUvVD5V2_kON0IHkeyqmD4QXKZRxgLDUFSe7bzdFuRHwspidW5oXnKIRBH_4Z7hIJxKCgvXY2QXQxL6cQLGc9Fb8-G5O7u32xc3_ycRClyYrsmWcMLIJb-Vpiy-T_JfRUdFmbzdgI5Ni1JvftCekwoITxuz92qLZ6qQaYGh9zI9c7wkMPhyoGNuZNTip6jhAbxECMK1AU1jfz0hIWzRFC9B8_jgxRIJbUtTz4l3eRBLljHp5oP886zAogAS4V31e7fYpewPSWGXzXkrg',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'AQBuIZsPCadHS5XtNOQ7U9dX2tEW7Q5v72_30eZB3vN01du2iRXJstFf3ZwFt9gWvXxeU3kqLrq6O4TjYKZVuKBDHpAInpi_nNzcJLg_bBSQ22a5LBBYFdvf4reFMNMXsw8',
  scope: 'playlist-read-private playlist-read-collaborative user-modify-playback-state user-library-read user-library-modify playlist-modify-private playlist-modify-public user-read-playback-state user-read-currently-playing user-top-read'
}
*/

const callback = async (req, res) => {
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
}

const getNewToken = async (req, res) => {
  const { refreshToken } = req.params

  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
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
      const payload = {
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        refresh_token: refreshToken,
        scope: data.scope
      }
      const query = querystring.stringify(payload);
      //console.log('query', query)
      //console.log('redirecting to new site')
      res.json({"new_url": `${process.env.CLIENT_REDIRECTURI}?${query}`});
  }).catch(err => {
    console.log(err)
  });
}

module.exports = {
    start,
    login,
    callback,
    getNewToken
}