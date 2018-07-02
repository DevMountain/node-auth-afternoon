<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we'll continue to use `passport`, but instead use the `GitHub` provider this time. We'll use the same `Default App` from the mini project earlier and modify it to accept the `GitHub` provider.

At the end of this project, you'll have a fully-working node back end that can authorize with GitHub and return a list of students for the authorized GitHub user.

## Setup

* Fork and clone this repository.
* `cd` into the project directory.
* Run `npm install` to get the provided dependencies.

## Step 1

### Summary

In this step, we'll modify the `Default App` on `manage.auth0.com` to accept the `GitHub` provider.

### Instructions

* Go to `manage.auth0.com` and login to the account you created in the mini project from earlier.
* Using the left navigation bar, click on `Connections` and then click on `Social`.
* Turn on the `GitHub` slider.
* Make sure the slider is on for the `Default App`.
* Select `Continue`.
* Select `Save`.
* Close the modal.

## Step 2

### Summary

In this step, we'll use `npm` to get the required passport dependencies.

### Instructions

* Install and save `passport` and `passport-auth0`.

### Solution

<details>

<summary> <code> NPM Install </code> </summary>

```
npm install --save passport passport-auth0
```

</details>

## Step 3

### Summary

In this step, we'll create a `.env` file. `.env` will be responsible for storing our client's `id`, `domain`, and `secret`. We'll use `.gitignore` on this file so GitHub can't see it.

### Instructions

* Install and save `dotenv`.
* Create a `.env` file.
* Open `.env`.
* Create 3 variables with the names `DOMAIN`, `CLIENT_ID`, and `CLIENT_SECRET`.
  * The values of these variables should equal the values on `manage.auth0.com` for `Default App`.
* Add `.env` to `.gitignore`.
* Require and configure `dotenv` at the top of your file.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by installing and saving the `dotenv` package. Do so by running `npm install --save dotenv`. Now create a `.env` file. The reason we are making this file is so that GitHub doesn't publicly display our sensitive information on `manage.auth0.com`. You never want to push a secret up to GitHub and if you ever do, always immediately refresh your secret.

Open your `.env` file and create 3 variables, `DOMAIN`, `CLIENT_ID`, and `CLIENT_SECRET`.

We can then add our information from `manage.auth0.com` into a `domain`, `clientID`, and `clientSecret` property. ( replace the dots with your actual information )

```
DOMAIN=...
CLIENT_ID=...
CLIENT_SECRET=...
```

Then, we can add this file to our `.gitignore` so we don't accidentally push it to GitHub.

Now we need to require and configure `dotenv` at the top of our file. You don't need to save it to a variable, you just need to require it and invoke the `config` method off of the invocation of `require`.

</details>

### Solution
<details>

<summary> <code> NPM Install </code> </summary>

```
npm install --save dotenv
```

</details>

<details>

<summary> <code> .env </code> </summary>

```
DOMAIN=...
CLIENT_ID=...
CLIENT_SECRET=...
```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>


## Step 4

### Summary

In this step, we'll configure our app to use sessions, initialize `passport`, configure `passport` to use sessions, and have `passport` use an Auth0 Strategy that we will create.

### Instructions

* Open `index.js`.
* Require `passport` in a variable called passport.
* Require `passport-auth0` in a `Auth0Strategy` variable.
* Configure the app to use sessions.
  * Hint: `secret`, `resave`, and `saveUninitialized`.
* Initialize `passport`.
* Configure `passport` to use sessions.
* Configure `passport` to use a new Auth0 Strategy.
  * The values for `domain`, `clientID`, and `clientSecret` should be taken from `.env`.
  * Set the callback URL to `'/login'`.
  * Add a `scope` property and give it the value `"openid email profile"`.

<details>

<summary> Detailed Instructions </summary>

<br />

To begin, let's require `passport` and  `passport-auth0` into variables called `passport` and `Auth0Strategy` at the top of our `index.js` file.

```js
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
```

We need to configure our app to use sessions. Invoke the `use` method off of the `app` object. Pass in as an argument the invocation of `session`. The `session` invocation should take an object as an arugment with 3 key value pairs, `secret` with the value of any string you'd like, `resave` with the value of false, and `saveUninitialized` with the value of false.

```js
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));
```

We now need to initialize passport and configure it to use sessions. Invoke the `use` method off of the `app` object. Pass in as an argument the `passport` variable from the top of the `index.js` file. `passport` is an object with methods that we'll use. Invoke the `initialize` method off of the passport object. On the next line, invoke the `use` method off of the `app` object again. Pass in as an argument the `passport` and invoke the `session` method.

```js
app.use( passport.initialize() );
app.use( passport.session() );
```

We can now pass `passport.use()` a `new Auth0Strategy` that uses the credentials from `.env`, calls back to `'/login'` and has a `scope` property with the value `"openid email profile"` as the first argument and a callback function as the second argument. The callback function should have the parameters  `accessToken, refreshToken, extraParams, profile, done` and should return done invoked with the two arguments `null, profile`.

```js
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   return done(null, profile);
 }
) );
```

</details>

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
) );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 5

### Summary

In this step, we'll configure passport's `serializeUser` and `deserializeUser` methods.

### Instructions

* Open `index.js`.
* Call `passport.serializeUser`.
  * Pass in a function as the first argument.
  * The function should have two parameters: `user` and `done`.
  * The function should call `done` and with this object `{ clientID: user.id, email: user._json.email, name: user._json.name }`. (You don't need all of the data to be saved to your session so this is where you would choose what data to save to the session store and that would be what was passed. Here we will only pass three properities from the user parameter).
* Call `passport.deserializeUser`.
  * Pass in a function as the first argument.
  * The function should have two parameters: `obj` and `done`.
  * The functions should just call `done` and pass in `obj` as the first argument.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by opening `index.js`. After `passport.use( strategy )` let's add `passport.serializeUser` and `passport.deserializeUser`. These methods get called after a successful login and before the success redirect. According to the passport documentation, you use `serializeUser` to pick what properties you want from the returned `user` object and you use `deserializeUser` to execute any necessary logic on the new version of the `user` object. By new version of the `user` object, I mean that when you call `done(null, {})` in `serializeUser` the value of that object then becomes the value of the `obj` parameter in `deserializeUser`.

```js
passport.serializeUser( (user, done) => {

});

passport.deserializeUser( (obj, done) => {

});
```

Since we only want the `clientID`, `email`, and `name` from `user` we'll call done with a new object instead of the entire `user` object. Remember, we pick what properties we want in `serializeUser`.

```js
passport.serializeUser( (user, done) => {
  done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
});
```

This new object will then be passed on to `deserializeUser` when `done` is invoked. Since we don't have any additional logic to execute, simply call `done` with `null` and `obj`.

```js
passport.deserializeUser( (obj, done) => {
  done( null, obj );
});
```

</details>

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
) );

passport.serializeUser( (user, done) => {
  done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 6

### Summary

In this step, we'll create a `/login` endpoint that will use `passport` to authenticate with GitHub.

### Instructions

* Open `index.js`.
* Create a `GET` endpoint at `/login` that calls `passport.authenticate`.
  * The success redirect should equal `'/students'`
    * We'll create this endpoint later.
  * The failure redirect should equal `'/login'`.
  * The connection should be forced to use `'github'`.
    * Hint: You can force passport's connection by using a `connection` property. The value of this property comes from the connection name on your Auth0 account.

<details>

<summary> Detailed Instructions </summary>

<br />

Now that passport is completely setup and ready to handle authentication let's create a `'/login'` endpoint in `index.js`.

```js
app.get('/login');
```

We'll want to call `passport.authenticate` and pass in a strategy type and configuration object. The strategy type will be `'auth0'` since we are using an `auth0` strategy.

```js
app.get('/login',
  passport.authenticate('auth0',
    { }
  )
)
```

Then, in the configuration object we can specify the success and failure redirects, turn failure flash on, and force the connection type to `github`. We can do all of these by using the following properties in the configuration object: `successRedirect`, `failureRedirect`,  and `connection`. The success redirect should go to `'/students'`; The failure redirect should go to `'/login'`; The connection should be set to `'github'`.

```js
app.get( '/login',
  passport.authenticate('auth0',
    { successRedirect: '/students', failureRedirect: '/login', connection: 'github' }
  )
);
```

</details>


### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
) );

passport.serializeUser( (user, done) => {
  done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

app.get( '/login',
  passport.authenticate('auth0',
    { successRedirect: '/students', failureRedirect: '/login', connection: 'github' }
  )
);

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 7

### Summary

In this step, we will create an endpoint for `/students` that will return the list of student data.

### Instructions

* Open `index.js`.
* At the top of `index.js`, require `students.json` into a variable called `students`.
* Underneath the `get` endpoint `'/login'`, create a new `get` endpoint with the path `'/students'`.
* This endpoint should return the list of students with a status code of `200`.
* Open your browser and enter the address `http://localhost:3000/students`, you should see a json of student data matching the file you have in this project.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const students = require('./students.json');

const app = express();

app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
) );

passport.serializeUser( (user, done) => {
  done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

app.get( '/login',
  passport.authenticate('auth0',
    { successRedirect: '/students', failureRedirect: '/login', connection: 'github' }
  )
);

app.get('/students', ( req, res, next ) => {
  res.status(200).send(students)
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 8

### Summary

In this step, we will create authentication middleware for our `'/students'` endpoint to ensure that the student data is returned only if the user has been authenticated.

### Instructions

* Open `index.js`.
* Above the `'/students'` endpoint and below the `'/login'` endpoint, create a function called `authenticated`.
* This function should have the parameters `req`, `res`, and `next`.
* Inside the `authenticated` function, check to see if there is a `req.user`, if there is, call `next`. If there is not, send a status code of `401`.
* We will now inject this authentication middleware into our `'/students'` endpoint.
* Go to the `'/students'` endpoint and between the path and the handler function add the name of the authentication middleware function `authenticated`.
  * Now anytime a user tries to access the endpoint `'/students'`, this middleware function will first be invoked to ensure there is an authenticated user.
* Restart your server.
* Open your browser and enter the address `http://localhost:3000/students`.
* You should see `Unathorized` in your browser window.
* Now login with your app by going to `http://localhost:3000/login`.
* It should redirect you to `http://localhost:3000/students` and because you've been authenticated, you should once again see the list of student data.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const students = require('./students.json');

const app = express();

app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new Auth0Strategy({
  domain:       process.env.DOMAIN,
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:  '/login',
  scope: "openid email profile"
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
) );

passport.serializeUser( (user, done) => {
  done(null, { clientID: user.id, email: user._json.email, name: user._json.name });
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

app.get( '/login',
  passport.authenticate('auth0',
    { successRedirect: '/students', failureRedirect: '/login', connection: 'github' }
  )
);

function authenticated(req, res, next) {
  if( req.user ) {
    next()
  } else {
    res.sendStatus(401);
  }
})

app.get('/students', authenticated, ( req, res, next ) => {
  res.status(200).send(students)
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>


## Black Diamond

* Create a React front end that takes the array of students and displays it in a list of `Student` components.
  * A `Student` component should display a students's `name`, contact information, and `grade`.
* Use `express.static` to serve the React front end.

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>




