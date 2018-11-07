<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Bcrypt Dragon's Lair

The purpose of this project is to implement secure password authentication using the Bcrypt library. Bcrypt is used to salt and hash user passwords, so that we avoid storing plain-text passwords in the database. We will also practice front to back data transmission, from axios calls on the front-end, to express endpoints on the server, to SQL commands in the database. 

# Example

<img src="./readme_assets/demo.gif" alt="demo gif">

## Setup

* `fork` and `clone` this repository
* Open the `bcrypt-start` branch
* `cd` into the root of the project
* Run `npm install`
* Run `npm start`

At this point the app should load in the browser and you should see the view of three treasure hoards and the login bar at the top. None of the buttons are connected to functions at this point. 

<img src="./readme_assets/main-view.png" alt="main view">

## Step 1

### Summary

Here we will set up the server and get it listening on a port. We will install and require the necessary npm packages in order to do this.

### Instructions

Here we will create the server file.

* Create a folder called server on the root. 
* Create a file called `index.js` in the server folder.
* Install and require the following packages and store them on const variables
    * express
    * express-session
    * massive
    * body-parser
    * dotenv
        * When you require dotenv, immediately invoke the config method from this module.
* Define a const variable called app equal to express invoked.
* Define a const variable called PORT equal to 4000
* Use the json method of the body-parser package as top level middleware.  
* Make the server listen on this port number using app.listen
* Run nodemon and make sure there are no bugs.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}))
```

</details>

<br />

## Step 2

### Summary

Here we will connect the server to the database using massive. We will create a .env file on the root of the project to store our personal data such as the database connection string. We will also set up session top-level middleware. 

### Instructions

Here we will create a .env file to store the database connection string.

* Create a file in the root directory called `.env`
* Store a value here called CONNECTION_STRING, the value should come from your heroku db settings.
* Store a value here called SESSION_SECRET and make up any value for this.
* In `index.js`, destructure CONNECTION_STRING and SESSION_SECRET from process.env, storing it on a const variable.
* Create the database connection by invoking massive and passing in the CONNECTION_STRING. 
* Create a .then callback function on the massive invocation, and store the resulting database connection using app.set.
    * <details>

        <summary> storing massive connection </summary> 

        ```js
        massive(CONNECTION_STRING).then(db => {
            app.set('db', db);
        })
        ```
    </details>
* Set up session as top-level middleware by invoking app.use and passing in session invoked with a configuration object.
    * The session configuration object should have properties `resave` set to true, `saveUninitialized` set to false, and `secret` set to SESSION_SECRET.
* Take the contents of queries.sql in the DB folder and run that in your database using SQL tabs. This will create the necessary user and treasure tables. 

### Solution

<details>
<summary><code> .env </code></summary>

```
CONNECTION_STRING=string_from_heroku_db
SESSION_SECRET=asdfa12341234
```

</details>
<details>
<summary><code> server.index.js </code></summary>

```js
const { CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})
```

</details>

## Step 3

### Summary

Here we will program the register and log-in functionality. The user will be able to submit a name and password, and select whether they are registering as an admin or not. 

### Instructions

Open App.js. There is a user object on state, which needs to be updated with a method, and both the method and the value need to be passed as props to the Header component. 

* Program the updateUser method to update state.user with a parameter called user.
* Bind this method in the constructor, so that it will have the right this-context.
* Pass updateUser and this.state.user as props to the Header component.
* Pass this.state.user as a prop to the Container component.

Open Header.js. Here we will program the handleUsernameInput and handlePasswordInput methods to store what the user types on state.

* Program the handleUsernameInput method to take an event object, and store the value on this.state.username
    * To do this, use setState, and the value is stored on event.target.value
* Do the same for handlePasswordInput method, but this time, it should update the password value on state.
* Now set these methods as onChange functions for the appropriate input boxes in the login container.
    * Use an arrow function for the onChange value, to bind these methods.

Now we need to allow the user to select whether they are creating an admin account or not. There is a checkbox for this in the login component. 

* The toggleAdmin method should setState for isAdmin to be the opposite value of this.state.isAdmin. 
    * use `!this.state.isAdmin` as the new value
* Set the onChange value for the checkbox input to be this method, wrapped in an arrow function to bind it.  

Now that we are storing these values, we can program the login and register functions. These will both be POST requests that send the username, password and isAdmin values from state. 

* Install and import axios.
* Program the login method to send a POST request to '/auth/login'. Send an object with username and password from state.
    * Destructure username and password from state.
    * In the .then of the axios request, set username and password on state to empty strings, using setState. 
    * Also in the .then, invoke this.props.updateUser passing in an object with properties username and isAdmin, so that we can update the user object on App.js.
    * Make sure to bind this method in the constructor.

* Program the register method to send a POST request to '/auth/register', with an object with username, password and isAdmin values from state.
    * Destructure username, password, and isAdmin from state.
    * In the .then of the axios request, set username and password on state to empty strings, using setState.
    * Also in the .then, invoke this.props.updateUser passing in and object with properties username and isAdmin, so that we can update the user object on App.js.
    * Bind this method in the constructor

* Program the logout method to send a GET request to '/auth/logout'.
* Bind the logout method in the constructor.
* In the .then, invoke this.props.updateUser passing in an empty object, to reset the user object on App.js state.

### Solution

<details><summary><code> src/App.js </code></summary>

```js
// bind the method in the constructor
this.updateUser = this.updateUser.bind(this);
// write the method functionality
updateUser(user) {
    this.setState({ user })
}
// pass props
<Header updateUser={this.updateUser} user={this.state.user}/>
<Container user={this.state.user}>
```

</details>
<details><summary><code> src/Components/Header.js </code></summary>

```js
// bind methods in constructor
this.login = this.login.bind(this);
this.logout = this.logout.bind(this);
this.register = this.register.bind(this);
// ...
handleUsernameInput(event) {
    this.setState({username: event.target.value})
} 
handlePasswordInput(event) {
    this.setState({password: event.target.value})
}
toggleAdmin() {
    this.setState({isAdmin: !this.state.isAdmin})
}
login() {
    const { username, password } = this.state;
    axios.post('/auth/login', { username, password })
         .then( () => {
             this.setState({
                 username: '',
                 password: ''
             })
             this.props.updateUser({username, isAdmin})
         })
}
logout() {
    axios.get('/auth/logout').then(()=>{
        this.props.updateUser({})
    })
}
register() {
    const { username, password, isAdmin } = this.state;
    axios.post('/auth/register', { username, password, isAdmin })
         .then( ()=> {
             this.setState({
                 username: '',
                 password: ''
             })
             this.props.updateUser({username, isAdmin})
         })
}

// username input box 

<input type="text" placeholder="Username" value={username} onChange={e=>this.handleUsernameInput(e)}/>

// password input box

<input type="password" placeholder="Password" value={password} onChange={e=>this.handlePasswordInput(e)}/>

// admin checkbox

<input type="checkbox" id="adminCheckbox" onChange={()=>this.toggleAdmin()}/>
```

</details>

## Step 4

### Summary

Here we will create the server endpoints for login, register and logout. We will create an auth controller file and import the bcryptjs package here.

### Instructions

* Create a folder called controllers in server.
* Create a file called authController.js in controllers. 
* Open `server/index.js` and require the authController.js file storing it on a const variable called ac.
* Create a POST endpoint with url '/auth/login' and method ac.login



* Go back to authController.js and install and require `bcryptjs`. Store it on a const variable called bcrypt. 
    * This package allows us to hash and salt passwords.
* Set module.exports equal to an object. 
    * On this object we will create our auth endpoint functions

The login endpoint function

* Create a property called login, with the value of an async function that takes a req and res parameter.
* Destructure username and password from req.body, storing them on const variables. 
* Get the database instance using req.app.get('db')
* Using the `get_user` SQL file, query the database for a user with a username matching the username from req.body.
* Store the result of the SQL query on a const variable called user. 
    * Remember that SQL queries come back in an array, so take the first item of the result to be your user variable. 
* If there is not user found, send a response with status 401, and the string 'User  not found. Please register as a new user before loggin in.'
* Otherwise, create a const variable called isAuthenticated and set it equal to `bcrypt.compareSync(password, user.hash)`
* If isAuthenticated is false, send a response with status code 403, and the string 'Incorrect password'.
* Otherwise, set req.session.user to be the user record that was retrieved from the database. 
* Then send req.session.user as a response with status code 200.

<details><summary><code> login function </code></summary>

```js
login: async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await req.app.get('db').get_user([username]);
  const user = foundUser[0];
  if (!user) {
      return res.status(401).send('User not found. Please register as a new user before logging in.');
  }
  const isAuthenticated = bcrypt.compareSync(password, user.hash);
  if (!isAuthenticated) {
      return res.status(403).send('Incorrect password');
  }
  req.session.user = { isAdmin: user.isadmin, id: user.id, username: user.username };
  return res.send(req.session.user);
}
```

</details>

The register endpoint function

* In server/index.js we will create the register endpoint. 
* Create a POST endpoint with url '/auth/register' and method ac.register

* Go back to authController.js and create a register method with parameters req and res.
* Destructure username, password and isAdmin from req.body.
* Get the database instance and run the sql file `check_existing_user`, passing in username.
* If existingUser is defined, send a response with status 409 and the text 'Username taken');
* Otherwise, create a const variable called salt, equal to `bcrypt.genSaltSync(10)`.
* Create a const variable called hash, equal to `bcrypt.hashSync(password, salt)`.
* Asynchronously (using await) run the register_user SQL file, passing in isAdmin, username, and hash as parameters.
    * Remember that SQL function parameters should be passed in as an array.
* Set the value of this SQL query to a variable called user.
    * It will come as an array, and we just need the first element in the array. 
* Set req.session.user to be an object with properties isAdmin, id, and username, equal to user.isadmin, user.id, and user.username. 

<details><summary><code> register function </code></summary>

```js
register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const existingUser = await req.app.get('db').check_existing_user([username]);
    if (existingUser[0]) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const createdUser = await req.app.get('db').register_user([isAdmin, username, hash]);
    const user = createdUser[0];
    req.session.user = { isAdmin: user.isadmin, id: user.id, username: user.username };
    return res.status(200).send(req.session.user);
  }
```

</details>

The logout endpoint function

* Go to server/index.js and create a GET endpoint with url '/auth/logout' and method ac.logout

* Go back to authController.js and create a logout property with the value of an async function with parameters req and res
* This function should run req.session.destroy()
* Then send a response with a status of 200.

<details><summary><code> logout function </code></summary>

```js
logout: (req, res) => {
  req.session.destroy();
  return res.sendStatus(200);
}
```

</details>

### Solution

<details><summary><code> server/controllers/authController.js </code></summary>

```js
const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get('db').get_user([username]);
    const user = foundUser[0];
    if (!user) {
      return res.status(401).send('User not found. Please register as a new user before logging in.');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send('Incorrect password');
    }
    req.session.user = { isAdmin: user.isadmin, id: user.id, username: user.username };
    return res.send(req.session.user);
  },

  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const existingUser = await req.app.get('db').check_existing_user([username]);
    if (existingUser[0]) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const createdUser = await req.app.get('db').register_user([isAdmin, username, hash]);
    const user = createdUser[0];
    req.session.user = { isAdmin: user.isadmin, id: user.id, username: user.username };
    return res.status(200).send(req.session.user);
  },
  logout: (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  },
};

```

</details>
<details><summary><code> server/index.js </code></summary>

```js
const ac = require('./controllers/authController.js');

// endpoints

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/logout', ac.logout);
```

</details>

## Step 5

### Summary

Here we will program the treasure-related GET requests in Container.js. There are three methods corresponding to the three treasure hoards, namely getDragonTreasure, getAllTreasure, and getMyTreasure.

### Instructions

* Program the getDragonTreasure method to make a GET request to '/api/treasure/dragon'.
* The resulting data needs to be stored on state.treasures.dragon 
    * Remember not to mutate the object on state directly. You may use the object spread operator.
* Set this method as the onClick value for the See Dragon's Treasure button. Wrap it in an arrow function to bind it. 

* Program the getAllTreasure method to make a GET request to '/api/treasure/all'.
* The resulting value needs to be stored on state.treasures.all
    * Remember not to mutate the object on state directly. You may use the object spread operator.
* Set this method as the onClick value for the See All Treasure button. Wrap it in an arrow function to bind it.

* Program the getMyTreasure method to make a GET request to '/api/treasure/user'.
* The resulting value should be stored on state.treasures.user
    * Remember not to mutate the object on state directly. You may use the object spread operator.
* Set this method as the onClick value for the See My Treasure button. Wrap it in an arrow function to bind it. 

### Solution

<details><summary><code> src/components/Container.js </code></summary>

```js
getDragonTreasure() {
    axios.get('/api/treasure/dragon')
         .then(res=>{
             this.setState({
                 treasures: { ...this.state.treasures, dragon: res.data}
             })
         })
}
getAllTreasure() {
    axios.get('/api/treasure/all')
         .then(res=>{
             this.setState({
                 treasures: { ...this.state.treasures,
                 all: res.data}
             })
         })
}
getMyTreasure() {
    axios.get('/api/treasure/user')
         .then(res=>{
             this.setState({
                 treasures: { ...this.state.treasures,
                 user: res.data}
             })
         })
}

// set the dragon treasure onClick value
<button className="title" onClick={()=>this.getDragonTreasure()}>

// set the all treasure onClick value
<button className="title" onClick={()=>this.getAllTreasure()}>

// set the my treasure onClick value
<button className="title" onClick={()=>this.getMyTreasure()>

```

</details>

## Step 6

### Summary

Here we will create another controller to handle the treasure related requests. This will be called treasureController.js and will have functions to handle the three GET requests that we wrote in the last step.

### Instructions

* Create a file called treasureController.js in the controllers folder. 
* Set module.exports to an object that will store our methods. 
* Create an async method called dragonTreasure with parameters req and res
    * This should get the database instance and run the get_dragon_treasure SQL file, passing in the number '1'.
    * Use the await keyword on the database query and store the result on a variable. 
    * Return the result of this database query as the response with status 200.

* Now go to server/index.js and require treasureController.js storing it on a const variable called `tc`.
* Create a get endpoint, '/api/treasure/dragon', with the function tc.dragonTreasure.

* Go back to treasureController.js and create an async method called getMyTreasure with parameters req and res.
    * This should get the database instance and run the get_my_treasure SQL file, passing in the id from req.session.user.
    * Use the await keyword on the database query, and store the result on a variable. 
    * Send the result of this database query as the response with status 200. 

* Now go to server/index.js and create a get endpoint, '/api/treasure/user', with the function tc.getMyTreasure.

* Go back to treasureController.js and create a method called getAllTreasure with parameters req and res.
    * This should get the database instance and run the get_all_treasure SQL file. 
    * Send a response with the result of this database query with status 200. 

* Back on server/index.js, create a get endpoint, '/api/treasure/all', with the function tc.getAllTreasure.

### Solution

<details><summary><code> server/controllers/treasureController.js </code></summary>

```js
module.exports = {
  dragonTreasure: async (req, res) => {
    const treasure = await req.app.get('db').get_dragon_treasure(1);
    return res.send(treasure);
  },
  getMyTreasure: async (req, res) => {
    const { id } = req.session.user;
    const myTreasure = await req.app.get('db').get_my_treasure([id]);
    res.send(myTreasure);
  },
  addMyTreasure: async (req, res) => {
    const { id } = req.session.user;
    const { treasureURL } = req.body;
    const myTreasure = await req.app.get('db').add_user_treasure([treasureURL, id]);
    return res.status(201).send(myTreasure);
  },
  getAllTreasure: async (req, res) => {
    const allTreasure = await req.app.get('db').get_all_treasure();
    return res.send(allTreasure);
  },
};

```

</details>
<details><summary><code> server/index.js </code></summary>

```js
const tc = require('./controllers/treasureController.js');

// endpoints
app.get('/api/treasure/dragon', tc.dragonTreasure);
app.get('/api/treasure/user', tc.getMyTreasure);
app.get('/api/treasure/all', tc.getAllTreasure);
```

</details>

## Step 7

### Summary

Here we will create authentication middelware functions and apply them on the server. These will check if a user is logged in or if the user is an administrator. 

### Instructions

* Create a middleware folder in the server folder.
* Create a authMiddleware.js file.
* Here set module.exports to an object.
    * Create a method called `usersOnly` with the parameters req, res, and next.
    * The usersOnly function should check if there is a user object on req.session. 
    * If there is not, send a response with status 401 and the string 'Please log in'.
    * Otherwise invoke next.

* In server/index.js require authMiddleware.js and store it on a const variable called auth. 
* On the '/api/treasure/user' endpoint, apply the usersOnly middleware that we have just created.

* Go back to authMiddleware.js and create a second method called `adminsOnly` with parameters req, res, and next.
* The adminsOnly function should check if isAdmin on req.session.user is true. 
* If isAdmin is false, send a response with status 403 and the string 'You are not an admin'.
* Otherwise, invoke next. 

* In server/index.js on the '/api/treasure/all' endpoint, apply the usersOnly AND adminsOnly middleware.

### Solution

<details><summary><code> server/middleware/authMiddleware.js </code></summary>

```js
module.exports = {
  usersOnly: (req, res, next) => {
    const { user } = req.session;
    if (!user) {
      return res.status(401).send('Please log in');
    }
    next();
  },
  adminsOnly: (req, res, next) => {
    const { isAdmin } = req.session.user;
    if (!isAdmin) {
      return res.status(403).send('You are not an admin');
    }
    next();
  },
};

```

</details>
<details><summary><code> server/index.js </code></summary>

```js
const auth = require('./middleware/authMiddleware.js');

// endpoints
app.get('/api/treasure/user', auth.usersOnly, tc.getMyTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure);
```

</details>

## Step 8

### Summary

Here we will add the functionality for a user to be able to add new treasure to their hoard. 

### Instructions

* In the Container component there is a method called addMyTreasure. This needs to update state.treasures.user to be a value passed in as an argument to the method.
* Bind this method in the constructor. 
* Pass this method as a prop to the Treasure component, which we are rendering below. 

* In the Treasure component, pass props.addMyTreasure as a prop to the AddTreasure component.
    * AddTreasure is conditionally rendered, depending upon whether the addMyTreasure prop was passed to it.

* In the AddTreasure component there is a method called addTreasure. This needs to be the onClick value for the Add button. 
* This method should make a POST request to '/api/treasure/user', with an object containing the treasureURL value from state.
* Then, in the .then, call this.props.addMyTreasure passing in res.data, and setState with treasureURL set to an empty string. 

### Solution

<details><summary><code> Container.js </code></summary>

```js
addMyTreasure (addedTreasure) {
    this.setState({
        treasures: {...this.state.treasures}, user: addedTreasure
    })
}

// pass prop to the user's treasure component
<Treasure treasure={user}
addMyTreasure={this.addMyTreasure} />
```

</details>

<details><summary><code> Treasure.js </code></summary>

```js
{props.addMyTreasure ? 
    <AddTreasure addMyTreasure={props.addMyTreasure}
    : null
}
```

</details>

<details><summary><code> AddTreasure.js </code></summary>

```js
addTreasure () {
    const { treasureURL } = this.state;
    axios.post('/api/treasure/user', { treasureURL })
         .then(res => {
             this.props.addMyTreasure(res.data)
             this.setState({ treasureURL: ''})
         })
}

// add the onclick to the add button
<button onClick={()=>this.addTreasure()}> Add </button>
```

</details>

## Step 9

### Summary

Here we need to finish programming the add treasure functionality on the server side. We will need to create a controller function and a POST endpoint for '/api/treasure/user'. We will need to apply the correct authentication middleware to this endpoint, so that it only works for logged-in users. 

### Instructions

* Open the treasureController.js file and create another method called addMyTreasure. 
* Destructure treasureURL from req.body and id from req.session.user.
* Get the database connection and invoke the add_user_treasure SQL file passing in treasureURL and id as arguments. 
* Send the results of this SQL query and the response. 

* Create a POST endpoint for this function in index.js.
    * The endpoint url should be '/api/treasure/user'.
* Apply the usersOnly auth middleware function to this endpoint. 

### Solution

<details><summary><code> treasureController.js </code></summary>

```js
addMyTreasure: async (req, res) => {
    const { id } = req.session.user;
    const { treasureURL } = req.body;
    const myTreasure = await req.app.get('db').add_user_treasure([treasureURL, id]);
    return res.status(201).send(myTreasure);
  }
```

</details>

<details><summary><code> server/index.js </code></summary>

```js
app.post('/api/treasure/user', auth.usersOnly, tc.addMyTreasure);
```

</details>

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
