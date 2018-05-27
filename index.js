const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dot-env').config();

app.use(bodyParser.json());


const app = express();
app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.get('/auth/callback', (req, res) => {
  
  let payLoad = {
    
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/auth/callback`

  }


})


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );