const express = require('express');
const session = require('express-session');

const app = express();


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );