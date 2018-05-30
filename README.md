<img src="https://s3.amazonaws.com/devmountain/www/img/dm_white_logo.png" width="200" align="right">

# Project Summary

In this project, we'll continue to use `Auth0`, but instead use the `GitHub` social provider this time. We'll use the same `node-auth` from the mini project earlier and modify it to accept the `GitHub` provider.

At the end of this project, you'll have a fully-working node back end that can authorize with GitHub and star a repository of your choice all from your application.

## Setup

* Fork and clone this repository.
* `cd` into the project directory.
* Run `npm install` to get the provided dependencies.

## Step 1

### Summary

In this step, we'll modify the `node-auth` on `manage.auth0.com` to accept the `GitHub` provider.

### Instructions

* Go to `manage.auth0.com` and login to the account you created in the mini project from earlier.
* Using the left navigation bar, click on `connections` and then click on `social`.
* Turn on the `GitHub` slider.
* click on `Github's` tile
* Under `Permissions` select `read:user`, `repo`.
* At the top of the same modal, click on `Applications`.
* Turn on the slider for the `node-auth`( or whatever you named your application ) if it isnt on already.
* next go to the APIs section in the left column and click on 	
`Auth0 Management API`
  * go to `API explorer` tab and create and authorize a test application


## Step 2

### Summary 

In this step, we'll use `npm` to get the required dependencies we will need for our project.

### Instructions

* Install `body-parser`, `axios`, `express-session`, and  `dotenv`.

### Solution

<details>

<summary> <code> NPM Install </code> </summary>

```
npm install body-parser dotenv axios express-session
```

</details>

## Step 3

### Summary

In this step, we'll set up `express-session` so we have a place to store our unique user's data when they log in.

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
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 4

### Summary

In this step, we'll create a `.env` to store our credentials for the `payload` object we plan to send to auth0. Our `.env` will be responsible for storing our `client_id`, `auth0-domain`, `client_secret`, and `session secret`. We'll use `.gitignore` on this file so GitHub can't see it. We will then want to set up our auth0 endpoint with our payload we plan to send

### Instructions

* Create a `.env`.
* Insert into your `.env` your `auth0_domain`, `client_ID`, `client_Secret` and `session secret`.
  * The values of these properties should equal the values on `manage.auth0.com` for `node-auth` (except for session secret which can be anything you choose).
* Add `.env` to `.gitignore`.
* Open `server/index.js` and require your `.env`.
* set up an endpoint to listen for a get request at the path `/callback`
*  Within that endpoint, make an object called payload that has the following properties from your .env
    * `client_id`
    * `client_secret`,
    * `code` (the `code` we expect to recieve from auth0 attached to `req.query`)
    * `grant_type` (which should be `authorization_code`)
    * `redirect_uri` which should redirect back to `http://${req.headers.host}/callback`

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating a `.env` file. The reason we are making this file is so that GitHub doesn't publicly display our sensitive information on `manage.auth0.com`. You never want to push a secret up to GitHub and if you ever do, always immediately refresh your secret.

We can add the information from `manage.auth0.com` into the .env under the following names
* `REACT_APP_AUTH0_DOMAIN`,
* `REACT_APP_AUTH0_CLIENT_ID`, 
* `REACT_APP_AUTH0_CLIENT_SECRET`

from your API Explorer Application
* `AUTH0_API_CLIENT_ID`
* `AUTH0_API_CLIENT_SECRET`


and then you can set your `SESSION_SECRET` to anything that isnt easily guessable

```js

SESSION_SECRET=...
REACT_APP_AUTH0_DOMAIN=...
REACT_APP_AUTH0_CLIENT_ID=...
REACT_APP_AUTH0_CLIENT_SECRET=...

AUTH0_API_CLIENT_ID=...
AUTH0_API_CLIENT_SECRET=...
```

Next, we can add this file to our `.gitignore` so we don't accidentally push it to GitHub. After it has been added, let's move on to creating an endpoint that will handle our authorization. First we want to open index.js and use our initialized express instance (i.e. app) to listen for a get request at the path `/callback`

```js
app.get('/callback', (req, res) => {

})
```

Now we can build our payload that uses the credentials from `.env` to authorize our user.

```js
app.get('/callback', (req, res) => {
  
  let payLoad = {
    
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`

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

AUTH0_API_CLIENT_ID=...
AUTH0_API_CLIENT_SECRET=...
```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
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
* in your `/callback` endoint.
  * write a function called `tradeCodeForAccessToken` that returns a promise in the form of an `axios.post` request.
  * the returned axios request should post to your `REACT_APP_AUTH0_DOMAIN/oauth/token`. 
  * you will also want to send the payload object built in the previous step as the body of the post.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by opening `index.js` and within our `/callback` endpoint, write a function called tradeCodeForAccessToken. within our tradeCodeForAccessToken function, return an axios.post request to your `auth0_domain/oauth/token` with the payload built in step 4

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
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
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

In this step we are going to write a function that will be invoked after our `tradeCodeForAccessToken` function. Call this function `tradeAccessTokenForUserInfo`. this function will take in the response of `tradeCodeForAccessToken` as a parameter (called `access_token`) and return a `Promise` in the form of an `axios.get` to your `auth0_domain/userinfo` with the `access_token` as a query

### Instructions

* Open `index.js`.
* in your `/callback` enpoint and under your `tradeCodeForAccessToken` function, write another function and call it `tradeAccessTokenForUserInfo` that takes in an `access_token` response as the parameter.
* Send the token back to Auth0 to get user info:
  * Within your function logic, return a `Promise` (i.e `axios.get`). The URL should be your Auth0 domain, with path `/userinfo/`, and query string `access_token` with the appropriate value.



<details>

<summary> Detailed Instructions </summary>

<br />

now we need to set up a way to send the `access_token` back to auth0 in exchange for the users information. Within `index.js` in your `/callback` endpoint and under your `tradeCodeForAccessToken` function write another function called `tradeAccessTokenForUserInfo` that will accept the `access_token` response from the previous step as a parameter.

```js
function tradeAccessTokenForUserInfo(accessTokenRespons){

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
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
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

In this step we are going to set the user Information to session, then make a call to the  `Auth0 Management API` we registered in step 1 so we can get an Auth0 `access_token`

### Instructions

* Open `index.js`.
* Write a function called `setUserToSessionGetAuthAccessToken` that takes in the `userInfoResponse` from the previous step and sets it to session.
* next construct an object called body and give it the following properties
  * `grant_type`: 'client_credentials',
  * `client_id`: process.env.AUTH0_API_CLIENT_ID,
  * `client_secret`: process.env.AUTH0_API_CLIENT_SECRET,
  * `audience`: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
* finally, return a `Promise` in the form of an `axios.post` request to your auth0 domain at the path `/oauth/token` and send the `body` object we just created as the body of the post
  
### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSessionGetAuthAccessToken(userInfoResponse){
    req.session.user = userInfoResponse.data
   
    body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }

    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, body)
  }

})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 8

### Summary

In this step we are going to write a function called `getGitAccessToken` that takes in the `authAccessTokenResponse` from the previous step as a parameter. within this function we will build an object that will allow us to send the `authAccessTokenResponse` in the headers of an `axios.get` request we will make to Auth0s API requesting the github API `access_token`.

### Instructions

* Open `index.js`.
* Write a function and call it `getGitAccessToken`, this function will accept a parameter (i.e the response from the previous steps function) that we will call `authAccessTokenResponse`
* within the `getGitAccessToken` function, create an object and call it options.
* this object has one property called `headers` which is equal to an object with the property `authorization`
* Set the `authorization` property equal to `Bearer ${authAccessTokenResponse.data.response}`
* Next, underneath the object in the same function return a `Promise` in the form of an `axios.get` to `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}` (we need the id of the user in Auth0's system which we attached to req.session.user, this id is attached to the `sub` property)
* the options object should be attached to your post request as the second parameter (i.e. after the path)

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSessionGetAuthAccessToken(userInfoResponse){
    req.session.user = userInfoResponse.data
   
    body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }

    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, body)
  }

  function getGitAccessToken(authAccessTokenResponse){
    let options = {
      headers: {
          authorization: `Bearer ${authAccessTokenResponse.data.access_token}`
        }
    }
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
  }
  
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 9

### Summary

In this step, we are going to build a function which grabs the access token from the response of the previous function and sets it equal to `req.session.gitAccessToken`, then redirects our user back to the home page. finally we are going to chain all of the functions we have written in our `/callback` endpoint with `.then`'s so they are called in the right order and are passed the correct arguments

### Instructions

* Write a function called `setGitTokenToSessions` which takes in the response from the previous function as a parameter, we will call this response `gitAccessToken`
* Set the `access_token` on the object of the identities array equal to `req.session.gitAccessToken`
* Redirect the user back to our landing page `'/'` using `req.redirect`.
* next go through your `/callback` endpoint and chain together all of your functions making sure to put them in the correct order and pass them the correct arguments.
* finally add a catch onto the final `.then` which will console.log any errors when running out function

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSessionGetAuthAccessToken(userInfoResponse){
    req.session.user = userInfoResponse.data
   
    body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }

    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, body)
  }

  function getGitAccessToken(authAccessTokenResponse){
    let options = {
      headers: {
          authorization: `Bearer ${authAccessTokenResponse.data.access_token}`
        }
    }
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
  }

  function setGitTokenToSessions(gitAccessToken){
    req.session.access_token = gitAccessToken.data.identities[0].access_token
    res.redirect('/')
  }

  exchangeCodeForAccessToken()
  .then(accessTokenResponse => exchangeAccessTokenForUserInfo(accessTokenResponse))
  .then(userInfoResponse => setUserToSessionGetAuthAccessToken(userInfoResponse))
  .then(authAccessTokenResponse => getGitAccessToken(authAccessTokenResponse))
  .then(gitAccessToken => setGitTokenToSessions(gitAccessToken))
  .catch(err =>  console.log(err))
  
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>


## Step 9

### Summary

In this step, we are going to use the `access_token` that we attached to `req.session.gitAccessToken` in the previous step to make calls to the github API and star/unstar repo's on the user's behalf. The access token we will be using is as good as the users github password so for security reasons we will make the calls to star and unstar repos from the server-side 

### Instructions

* Set up an endpoint with the path `/api/star`
* in the endpoint handler function, deconstruct `gitUser` and `gitRepo` from `req.query`
* make an axios PUT request to `https://api.github.com/user/starred/${gitUser}/${gitRepo}`
* In order to authorize our request, github needs the access token we set to `req.session.gitAccessToken`
  * send our access token as a query parameter of our put request (i.e `?access_token=....`)
* Next, within the `.then` of our put request we will close out our response with `res.status(200).end()` which signifies the POST was successful but that no data is being passed back to the front.
* Set up an identical GET endpoint to on `/api/unstar` with the only difference being, the axios call within this new endpoint makes an `axios.delete` instead of an `axios.put`

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSessionGetAuthAccessToken(userInfoResponse){
    req.session.user = userInfoResponse.data
   
    body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }

    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, body)
  }

  function getGitAccessToken(authAccessTokenResponse){
    let options = {
      headers: {
          authorization: `Bearer ${authAccessTokenResponse.data.access_token}`
        }
    }
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
  }

  function setGitTokenToSessions(gitAccessToken){
    req.session.access_token = gitAccessToken.data.identities[0].access_token
    res.redirect('/')
  }

  exchangeCodeForAccessToken()
  .then(accessTokenResponse => exchangeAccessTokenForUserInfo(accessTokenResponse))
  .then(userInfoResponse => setUserToSessionGetAuthAccessToken(userInfoResponse))
  .then(authAccessTokenResponse => getGitAccessToken(authAccessTokenResponse))
  .then(gitAccessToken => setGitTokenToSessions(gitAccessToken))
  .catch(err =>  console.log(err))
  
})

app.get('/api/star', (req, res) => {
  const { gitUser, gitRepo } = req.query;
  axios.put(`https://api.github.com/user/starred/${gitUser}/${gitRepo}?access_token=${req.session.access_token}`).then(response => {
    res.send('starred it!')
  }).catch((err) => console.log(err))
})

app.get('/api/unstar', (req, res) => {
  const { gitUser, gitRepo } = req.query;
  axios.delete(`https://api.github.com/user/starred/${gitUser}/${gitRepo}?access_token=${req.session.access_token}`).then(response => {
    res.send('unstarred it!')
  }).catch(err => console.log('error', err));
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>


## Step 10

### Summary

The last step in our server file is to set up an endpoint for us to send user data to the front as well as an endpoint to logout

### Instructions

* Set up an endpoint with the path `/user-data`
* in the handler function of our endpoint, send the data attached to `req.session.user` when hit
* Set up another endpoint at the path `/logout` which will call `req.session.destroy()` when hit and then `res.send` the string `'logged out'` 

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json());

const app = express();
app.use( session({
  secret: 'WhatEVer SecreT YOU wAnt',
  resave: false,
  saveUninitialized: false
}));

app.get('/callback', (req, res) => {

  let payLoad = {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/callback`
  }

  function tradeCodeForAccessToken(){
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, payLoad)
  }

  function tradeAccessTokenForUserInfo(accessTokenResponse){
    const accessToken = accessTokenResponse.data.access_token;
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`) 
  }

  function setUserToSessionGetAuthAccessToken(userInfoResponse){
    req.session.user = userInfoResponse.data
   
    body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`
    }

    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, body)
  }

  function getGitAccessToken(authAccessTokenResponse){
    let options = {
      headers: {
          authorization: `Bearer ${authAccessTokenResponse.data.access_token}`
        }
    }
    return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${req.session.user.sub}`, options)
  }

  function setGitTokenToSessions(gitAccessToken){
    req.session.access_token = gitAccessToken.data.identities[0].access_token
    res.redirect('/')
  }

  exchangeCodeForAccessToken()
  .then(accessTokenResponse => exchangeAccessTokenForUserInfo(accessTokenResponse))
  .then(userInfoResponse => setUserToSessionGetAuthAccessToken(userInfoResponse))
  .then(authAccessTokenResponse => getGitAccessToken(authAccessTokenResponse))
  .then(gitAccessToken => setGitTokenToSessions(gitAccessToken))
  .catch(err =>  console.log(err))
  
})

app.get('/api/star', (req, res) => {
  const { gitUser, gitRepo } = req.query;
  axios.put(`https://api.github.com/user/starred/${gitUser}/${gitRepo}?access_token=${req.session.access_token}`).then(response => {
    res.send('starred it!')
  }).catch((err) => console.log(err))
})

app.get('/api/unstar', (req, res) => {
  const { gitUser, gitRepo } = req.query;
  axios.delete(`https://api.github.com/user/starred/${gitUser}/${gitRepo}?access_token=${req.session.access_token}`).then(response => {
    res.send('unstarred it!')
  }).catch(err => console.log('error', err));
})

app.get('/api/user-data', (req, res) => {
  res.status(200).json(req.session.user)
})

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('logged out');
})

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>


## Step 10

### Summary

The last step in our project, is to set up the function which will initiate the users login request. this will be done from within out react-app. 

### Instructions

* Navigate to `App.js`
* make a variable called `redirectUri` and set it equal to ``encodeURIComponent(`${window.location.origin}/callback`)``
* next we are going to force a redirect to our auth0 login screen by setting `window.location` equal to `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize`, we will also want to pass along a few queries so our login attempt will succeed and we will get back the correct info
  * `client_id=REACT_APP_AUTH0_CLIENT_ID`
  * `&scope=openid%20profile%20email`
  * `redirect_uri=${redirectUri}`
  * `response_type=code`
    * (hint: remember the '&' symbol is used to chain queries on a url)



``` js
login = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);

    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
  }
```
## Black Diamond

 Now that you know how to make allow your users to make API calls to github from inside your application, go explore the docs and see what cool features you can add to your projects

 * <a href="https://developer.github.com/v3/">GitHub API Docs</a>
## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.
