const express = require('express');
const session = require('express-session');

const app = express();
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );