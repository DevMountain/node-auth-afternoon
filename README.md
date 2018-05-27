<img src="https://devmounta.in/img/logowhiteblue.png" width="250" align="right">

# Project Summary

In this project, we'll continue to use `Auth0`, but instead use the `GitHub` provider this time. We'll use the same `Default App` from the mini project earlier and modify it to accept the `GitHub` provider. We'll also gain some experience and exposure using technical documentation. 

At the end of this project, you'll have a fully-working node back end that can authorize with GitHub and retrieve a list of followers for the authorized GitHub user.

## Setup

* Fork and clone this repository.
* `cd` into the project directory.
* Run `npm install` to get the provided dependencies.

## Step 1

### Summary

In this step, we'll modify the `Default App` on `manage.auth0.com` to accept the `GitHub` provider.

### Instructions

* Go to `manage.auth0.com` and login to the account you created in the mini project from earlier.
* Using the left navigation bar, click on `connections` and then click on `social`.
* Turn on the `GitHub` slider.
* Under `Permissions` select `read:user`.
* At the top of the same modal, click on `Clients`.
* Turn on the slider for the `Default App`.

## Step 2

### Summary 

In this step, we'll use `npm` to get the required dependencies we will need for out project.

### Instructions

* Install `body-parser`, `axios`, `express-session`, and  `dotenv` .

### Solution

<details>

<summary> <code> NPM Install </code> </summary>

```
npm install body-parser dotenv axios express-session
```

</details>

## Step 3

### Summary

In this step, we'll set up `express-session` so we have a place to store our user's data when they log in.

### Instructions

* Open `index.js` 
* require `express-session` and set it equal to `session`
* invoke `session` and pass it an object with your session configurations
  * Hint: `secret`, `resave`, and `saveUninitialized`.
* finally wrap your invoked session with `app.use()` so that it gets used in your entire app 

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const session = require('express-session');

const app = express();
app.use( session({
  secret: 'kjbhkhbhjbkhjb',
  resave: false,
  saveUninitialized: false
}));


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 4

### Summary

In this step, we'll create a `dot-env` to store our credentials and the `payload` object we plan to send to auth0. Our `dot-env` will be responsible for storing our `client_id`, `auth0-domain`, `client_secret`, and `session secret`. We'll use `.gitignore` on this file so GitHub can't see it. We will then want to set up our auth0 endpoint with our payload we plan to send

### Instructions

* Create a `.env`.
* Insert into your `.env` your `auth0_domain`, `client_ID`, `client_Secret` and `session secret`.
  * The values of these properties should equal the values on `manage.auth0.com` for `Default App` (except for session secret which can be anything you choose).
* Add `.env` to `.gitignore`.
* Open `index.js` and require your `.env`.
* set up an endpoint to listen for a get request at the path `/auth/callback`
*  Within that endpoint, make an object called payload that has the following properties from your .env.
    * `client_id`
    * `client_secret`,
    * `code` (the `code` we expect to recieve from auth0 attached to `req.query`)
    * `grant_type` (which should be `authorization_code`)
    * `redirect_uri` which should redirect back to `http://${req.headers.host}/auth/callback`

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating a `.env` file. The reason we are making this file is so that GitHub doesn't publicly display our sensitive information on `manage.auth0.com`. You never want to push a secret up to GitHub and if you ever do, always immediately refresh your secret.

We can add our information from `manage.auth0.com` into the .env under the following names
* `REACT_APP_AUTH0_DOMAIN`,
* `REACT_APP_AUTH0_CLIENT_ID`, 
* `REACT_APP_AUTH0_CLIENT_SECRET`

and then you can set your `SESSION_SECRET` to anything that isnt easily guessable

```js

SESSION_SECRET=...
REACT_APP_AUTH0_DOMAIN=...
REACT_APP_AUTH0_CLIENT_ID=...
REACT_APP_AUTH0_CLIENT_SECRET=...

```

Then, we can add this file to our `.gitignore` so we don't accidentally push it to GitHub. After it has been added, let's move on to creating an endpoint that will handle our authorization. First we want to open index.js and use our initialized express session (i.e. app) to listen for a get request at the path `/auth/callback`

```js
app.get('/auth/callback', (req, res) => {

})
```

Now we can build our payload that uses the credentials from `.env` to authorize our user.

```js
app.get('/auth/callback', (req, res) => {
  
  let payLoad = {
    
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/auth/callback`

  }


})

```

</details>

### Solution

<details>

<summary> <code> .env  </code> </summary>

```js
SESSION_SECRET=...
REACT_APP_AUTH0_DOMAIN=...
REACT_APP_AUTH0_CLIENT_ID=...
REACT_APP_AUTH0_CLIENT_SECRET=...
```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dot-env').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'kjbhkhbhjbkhjb',
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
```

</details>


## Step 5

### Summary

In this step we will send the payload we created in the previous step to auth0 in exchange for an `access_token`.

### Instructions

* Open `index.js`.
* in your `/auth/callback` endoint.
  * write a function called `tradeCodeForAccessToken` that returns a promise in the form of an `axios.post` request.
  * the returned axios request should post to your `REACT_APP_AUTH0_DOMAIN/oauth/token`. 
  * you will also want to send the payload object built in the previous step as the body of the post.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by opening `index.js` and within our `/auth/callback` endpoint, write a function called tradeCodeForAccessToken. within our tradeCodeForAccessToken function, return an axios.post request to your `auth0_domain/oauth/token` with the payload built in step 4

```js

function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

```

</details>

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dot-env').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'kjbhkhbhjbkhjb',
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

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }
  
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 6

### Summary

In this step we are going to write a function to be called after our tradeCodeForAccessToken function runs, this function will take in the access token as a paramerter and return a GET request in the form of an `axios.get` to your `auth0_domain/userinfo` with the `access_token` as a query

### Instructions

* Open `index.js`.
* in your `/auth/callback` enpoint and under your tradeCodeForAccessToken function, write another function and call it tradeAccessTokenForUserInfo that takes in an `access_token` as the parameter.
* Send the token back to Auth0 to get user info:
  * Within your function logic return an axios GET request (i.e return a promise). The URL should be your Auth0 domain, with path `/userinfo/`, and query string `access_token` with the appropriate value.


<details>

<summary> Detailed Instructions </summary>

<br />

now we need to set up a way to send the access token back to auth0 in enxhange for the users information. Within `index.js` in your `/auth/callback` enpoint and under your tradeCodeForAccessToken function write another function called tradeAccessTokenForUserInfo that will accept an access token as a parameter.

```js
function tradeAccessTokenForUserInfo(access_token){

}
```

make sure to pull just the access token from the response

```js
function tradeAccessTokenForUserInfo(accessTokenResponse){
    
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }
```


</details>


### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dot-env').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'kjbhkhbhjbkhjb',
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

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }
  
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 7

### Summary

In this step, you'll be required to read documentation on `GitHub`'s API and the documentation for the `request` package. There won't be any detailed instructions on this step. The goal of this step is to expose you to having to read online documentation to figure out how certain technologies work.

* <a href="https://developer.github.com/v3/">GitHub API Docs</a>
* <a href="https://www.npmjs.com/package/request">Request NPM Package Docs</a>

### Instructions

* Open `index.js`.
* Use `NPM` to install and save `request`.
* Require `request`.
* Create a `GET` endpoint at `/followers`.
  * This endpoint should check to see if `req.user` exists.
    * If it does, use `request` to get a list of followers for the currently logged in user. Then return the response body from `request`.
    * It it doesn't, redirect to `'/login'`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const request = require('request');
const strategy = require(`${__dirname}/strategy.js`);

const app = express();
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( strategy );

passport.serializeUser( (user, done) => {
  const { _json } = user;
  done(null, { clientID: _json.clientID, email: _json.email, name: _json.name, followers: _json.followers_url });
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

app.get( '/login',
  passport.authenticate('auth0', 
    { successRedirect: '/followers', failureRedirect: '/login', failureFlash: true, connection: 'github' }
  )
);

app.get('/followers', ( req, res, next ) => {
  if ( req.user ) {
    const FollowersRequest = {
      url: req.user.followers,
      headers: {
        'User-Agent': req.user.clientID
      }
    };

    request(FollowersRequest, ( error, response, body ) => {
      res.status(200).send(body);
    });
  } else {
    res.redirect('/login');
  }
});

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 8

### Summary

In this step, we'll test the API and see if we can get an array of followers.

### Instructions

* Open a browser and go to `http://localhost:3000/login`.
* If you have no errors, try to complete the Black Diamond!

### Solution

<img src="https://github.com/DevMountain/node-auth-afternoon/blob/solution/readme-assets/1g.gif" />

## Black Diamond

* Create a React front end that takes the array of followers and displays it in a list of `Follower` components.
  * A `Follower` component should look like a user's information card.
  * It should display a follower's `avatar_url`, `html_url`, and `login` ( aka their username ). 
* Use `express.static` to server the React front end.

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://devmounta.in/img/logowhiteblue.png" width="250">
</p>