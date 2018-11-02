require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const ac = require('../controllers/authController');
const tc = require('../controllers/treasureController');
const protect = require('../middleware/authMiddleware');

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
  db.queries('$2a$10$9po0stCxZ1jA/6PWNh.W8.TYcxERDOaLte.FvVd.T..QYG.ZZSu9.').then(() => console.log('DB connected'));
});

app.use(express.json());

// ================================== //
// === Remove this before hosting === //
// app.use((req, res, next) => {
//   req.session.user = { id: 2, isadmin: false };
//   next();
// });
// ================================== //
// ================================== //

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/logout', ac.logout);

app.get('/api/treasure/dragon', tc.dragonTreasure);
app.get('/api/treasure/user', tc.getMyTreasure);
app.post('/api/treasure/user', protect.usersOnly, tc.addMyTreasure);
app.get('/api/treasure/all', protect.usersOnly, protect.adminsOnly, tc.getAllTreasure);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
