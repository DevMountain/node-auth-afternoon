<img src="https://devmounta.in/img/logowhiteblue.png" width="250" align="right">

# Project Summary

In this project, we'll continue to use `passport`, but instead use the `GitHub` strategy this time. We'll use the same `Default App` from the mini project earlier and modify it to accept the `GitHub` strategy. We'll also expose you to some practice of having to read online documentation. 

At the end of this project, you'll have a fully working node back end that can authorize with GitHub and retrieve a list of followers for the authorized GitHub user.

## Setup

* Fork and clone this repository.
* `cd` into the project directory.
* Run `npm install` to get the provided dependencies.

## Step 1

### Summary

In this step, we'll modify the `Default App` on `manage.auth0.com` to accept the `GitHub` strategy.

### Instructions

* Go to `manage.auth0.com` and login to the account you created in the mini project from earlier.
* Using the left navigation bar, click on `connections` and then click on `social`.
* Turn on the `GitHub` slider.
* Under `Permissions` select `read:user`.
* At the top of the same modal, click on `Clients`.
* Turn on the slider for the `Default App`.

## Step 2

### Summary 

In this step, we'll use npm to get the required passport dependencies.

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

In this step, we'll create a `config.js` and `strategy.js` file. `config.js` will be responsible for storing our client's `id`, `domain`, and `secret`. We'll use `.gitignore` on this file so GitHub can't see it. `strategy.js` will be responsible for creating and exporting a `new Auth0Strategy` that uses the values from `config.js`.

### Instructions

* Create a `config.js`.
* Open `config.js`.
* Use `module.exports` to export an object with a `domain`, `clientID`, and `clientSecret` property.
  * The values of these properties should equal the values on `manage.auth0.com` for `Default App`.
* Add `config.js` to `.gitignore`.
* Create a `strategy.js`.
* Open `strategy.js`.
* Require `passport-auth0` in a `Auth0Strategy` variable.
* Require `config.js`.
* Use `module.exports` to export a `new Auth0Strategy`.
  * The values for `domain`, `clientID`, and `clientSecret` should be taken from `config.js`.
  * Set the callback URL to `'/login'`.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating a `config.js` file. The reason we are making this file is so that GitHub doesn't publicly display our sensitive information on `manage.auth0.com`. You never want to push a secret up to GitHub and if you ever do, always immediately refresh your secret. In the `config.js` file use `module.exports` to export an object.

```js
module.exports = {

};
```

We can then add our information from `manage.auth0.com` into a `domain`, `clientID`, and `clientSecret` property. ( replace the dots with your actual information )

```js
module.exports = {
  domain: '...',
  clientID: '...',
  clientSecret: '...'
};
```

Then, we can add this file to our `.gitignore` so we don't accidentally push it to GitHub. After it has been added, let's move on to creating a `strategy.js` file. This file will allow us to create a strategy without bulking our `index.js` file. To begin, let's import `passport-auth0` into a variable called `Auth0Strategy` and import `config.js` into a variable called `config`. I will also destructure `config` for easy referencing, however this step is not required.

```js
const Auth0Strategy = require('passport-auth0');
const config = require(`${__dirname}/config.js`);
const { domain, clientID, clientSecret } = config;
```

Now we can use `module.exports` to export a `new Auth0Strategy` that uses the credentials from `config.js` and calls back to `'/login'`.

```js
const Auth0Strategy = require('passport-auth0');
const config = require(`${__dirname}/config.js`);
const { domain, clientID, clientSecret } = config;

module.exports = new Auth0Strategy({
   domain:       domain,
   clientID:     clientID,
   clientSecret: clientSecret,
   callbackURL:  '/login'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);
```

</details>

### Solution

<details>

<summary> <code> config.js </code> </summary>

```js
module.exports = {
  domain:       '...',
  clientID:     '...',
  clientSecret: '...',
};
```

</details>

<details>

<summary> <code> strategy.js </code> </summary>

```js
const Auth0Strategy = require('passport-auth0');
const config = require(`${__dirname}/config.js`);
const { domain, clientID, clientSecret } = config;

module.exports = new Auth0Strategy({
   domain:       domain,
   clientID:     clientID,
   clientSecret: clientSecret,
   callbackURL:  '/login'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);
```

</details>

## Step 3

### Summary

In this step, we'll require `strategy.js`, configure the app to use sessions, initialize passport, configure passport to use sessions, and have passport use our strategy from `strategy.js`.

### Instructions

* Open `index.js`.
* Require `passport` in a variable called passport.
* Require `strategy.js` in a variable called strategy.
* Configure the app to use sessions. 
  * Hint: `secret`, `resave`, and `saveUninitialized`.
* Initialize `passport`.
* Configure `passport` to use sessions.
* Configure `passport` to use our strategy from `strategy.js`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
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

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 4

### Summary

In this step, we'll configure passport's `serializeUser` and `deserializeUser` methods.

### Instructions

* Open `index.js`.
* Call `passport.serializeUser`.
  * Pass in a function as the first argument.
  * The function should have two parameters: `user` and `done`. 
  * The function should call `done` and with an object that only has the `clientID`, `email`, `name`, and `followers_url` from `user._json` as the first arugment.
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

Since we only want the `clientID`, `email`, `name`, and `followers_url` from `user._json` we'll call done with a new object instead of the entire `user` object. Remember, we pick what properties we want in `serializeUser`.

```js
passport.serializeUser( (user, done) => {
  const { _json } = user;
  done(null, { clientID: _json.clientID, email: _json.email, name: _json.name, followers: _json.followers_url });
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
const express = require('express');
const session = require('express-session');
const passport = require('passport');
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

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 5

### Summary

In this step, we'll create a `/login` endpoint that will use `passport` to authenticate with GitHub.

### Instructions

* Open `index.js`.
* Create a `GET` endpoint at `/login` that calls `passport.authenticate`.
  * The success redirect should equal `'/followers'`
    * We'll create this endpoint later.
  * The failure redirect should equal `'/login'`.
  * Failure flash should be enabled.
  * The connection should be forced to use `'GitHub'`.
    * Hint: You can force passport's connection by using a `connection` property.

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

Then, in the configuration object we can specify the success and failure redirects, turn failure flash on, and force the connection type to `GitHub`. We can do all of these by using the following properties in the configuration object: `successRedirect`, `failureRedirect`, `failureFlash`, and `connection`. The success redirect should go to `'/followers'`; The failure redirect should go to `'/login'`; Failure flash should be set to `true`; The connection should be set to `'github'`.

```js
app.get( '/login',
  passport.authenticate('auth0', 
    { successRedirect: '/followers', failureRedirect: '/login', failureFlash: true, connection: 'github' }
  )
);
```

</details>


### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
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

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
```

</details>

## Step 6

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

## Step 7

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