import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: '',
      starred: 'star'
    }
  }

  componentDidMount(){
    axios.get('/user-data').then(user => {
      console.log(user);
      this.setState({
        user: user.data
      })
    })
  }

  login = () => {
    const redirectUri = encodeURIComponent(`http://localhost:4000/callback`);
    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
  }

  star = () => {
    if(this.state.starred === 'star'){
      this.setState({
        starred: 'unstar'
      })
      return axios.get('/star')
    }else {
      this.setState({
        starred: 'star'
      })
      return axios.get('/unstar')
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          {
            this.state.user ?
            <div>
              <p>{this.state.user.name}</p>
              <button onClick={this.star}>{this.state.starred}</button>
            </div>
            :
            <button onClick={this.login}>login</button>
          }
        </div>
      </div>
    );
  }
}

export default App;
