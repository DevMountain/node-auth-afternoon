import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: '',
      starred: 'star',
      gitRepo:'',
      gitUser:'',
      message:'Please Login'
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

  logout = () => {
    axios.get('/logout').then(response => {
      this.setState({
        message: response.data,
        user:''
      })
    })
  }

  changeHandler = (key, value) => {
    this.setState({
      [key]: value,
      starred: 'star'
    })
  }

  star = () => {
    if(this.state.starred === 'star'){
      this.setState({
        starred: 'unstar'
      })
      return axios.get(`/star?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
    }else {
      this.setState({
        starred: 'star'
      })
      return axios.get(`/unstar?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
    }
  }

  render() {
    console.log(this.state.gitRepo);
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
                <button onClick={this.star}>{this.state.starred}</button>
                <button onClick={this.logout}>logout</button>
              </div>
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
