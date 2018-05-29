const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payload = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    code: req.query.code,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }
  
  function exchangeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payload)
  }

  function exchangeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSession(userInfoResponse){
    req.session.user = userInfoResponse.data
    res.send(req.session.user)
  }

  exchangeCodeForAccessToken()
  .then(accessTokenResponse => exchangeAccessTokenForUserInfo(accessTokenResponse))
  .then(userInfoResponse => setUserToSession(userInfoResponse));        
})

app.get('/gitaccess', (req, res) => {
  options = { 
    method: 'POST',
    url: 'https://joshborup.auth0.com/oauth/token',
    headers: { 
        'content-type': 'application/json'
    },
    body: {
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_API_CLIENT_ID,
        client_secret: process.env.AUTH0_API_CLIENT_SECRET,
        audience: 'https://joshborup.auth0.com/api/v2/'
    },
    json: true 
  }
  axios.post('https://joshborup.auth0.com/oauth/token', options.body).then(resp => {
    req.session.access_token = resp.data.access_token
    let options = {
    headers: {authorization: `Bearer ${req.session.access_token}`}
    }
    axios.get(`https://joshborup.auth0.com/api/v2/users/${req.session.user.sub}`, options).then(resp => {
        console.log(resp.data.identities)
        req.session.access_token = resp.data.identities[0].access_token
        res.send(req.session.access_token)
    }).catch(err => console.log(err))
  })
})

app.get('/star', (req, res) => {
  axios.put(`https://api.github.com/user/starred/joshborup/node-auth-afternoon?access_token=${req.session.access_token}`).then(response => {
    res.send('starred it!')
  }).catch(err => console.log('error', err));
})

app.get('/unstar', (req, res) => {
  axios.delete(`https://api.github.com/user/starred/joshborup/node-auth-afternoon?access_token=${req.session.access_token}`).then(response => {
    res.send('unstarred it!')
  }).catch(err => console.log('error', err));
})

app.get('/login', (req, res)=>{
  let redirectUri = encodeURIComponent(`http://${req.headers.host}/callback`);
  let login = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
  console.log(login)
  res.redirect(login);
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );