require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const ac = require('../controllers/authController');

const app = express();
const { SESSION_SECRET, CONNECTION_STRING } = process.env;

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  db.queries().then(() => console.log('DB connected'));
});

app.use(express.json());

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
