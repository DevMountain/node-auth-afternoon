import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: '',
      starred: false,
      gitRepo: 'node-auth-afternoon',
      gitUser: '',
      message: 'Please Login',
      errorMessage: ''
    };
  }

  componentDidMount(){
    axios.get('/api/user-data').then(user => {
      this.setState({
        user: user.data,
        gitUser: user.data.nickname
      });
    });
  }

  login = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);
  
    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`;
  }

  logout = () => {
    axios.post('/api/logout').then(response => {
      this.setState({
        message: response.data,
        user:''
      });
    });
  }

  changeHandler = (key, value) => {
    this.setState({
      [key]: value,
      starred: false
    });
  }

  star = () => {
    if (this.state.starred) {
      return axios.delete(`/api/star?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
        .then(() => this.setState({ starred: false }))
        .catch(error => this.setState({ errorMessage: error.message }));
    } else {
      return axios.put(`/api/star?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
        .then(() => this.setState({ starred: true }))
        .catch(error => this.setState({ errorMessage: error.message }));
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          {
            this.state.user ?
            <div>
              <div className='user-image-container'>
                <img src={this.state.user.picture}/>
              </div>

              <p>{this.state.user.name}</p>

              <input onChange={(e)=> this.changeHandler(e.target.name, e.target.value)}  name='gitUser' placeholder='Repo Owner' value={this.state.gitUser}/>
              <input onChange={(e)=> this.changeHandler(e.target.name, e.target.value)} name='gitRepo' placeholder='Repo to star' value={this.state.gitRepo} />

              <div>
                <button onClick={this.star}>{this.state.starred ? 'unstar' : 'star'}</button>
                <button onClick={this.logout}>logout</button>
              </div>
              <div>{this.state.errorMessage}</div>
            </div>
            :
            <div>
              <p>{this.state.message}</p>
              <button onClick={this.login}>login</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
