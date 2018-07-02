import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      gitRepo: 'node-auth-afternoon',
      gitUser: '',
      message: ''
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.star = this.star.bind(this);
    this.unstar = this.unstar.bind(this);
  }

  componentDidMount() {
    axios.get('/api/user-data').then(user => {
      this.setState({
        user: user.data,
        gitUser: user.data.nickname
      });
    });
  }

  login() {
    const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);
  
    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`;
  }

  logout() {
    axios.post('/api/logout').then(response => {
      this.setState({
        message: response.data,
        user:''
      });
    });
  }

  star() {
    this.setState({ message: 'Starring...' });
    axios.put(`/api/star?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
      .then(() => this.setState({ message: 'Successfully starred repo' }))
      .catch(error => this.setState({ message: error.message }));
  }
    
  unstar() {
    this.setState({ message: 'Unstarring...' });
    axios.delete(`/api/star?gitUser=${this.state.gitUser}&gitRepo=${this.state.gitRepo}`)
      .then(() => this.setState({ message: 'Successfully unstarred repo' }))
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return (
      <div className="App">
        <div>
          {this.state.user
            ? <div>
                <div className='user-image-container'>
                  <img src={this.state.user.picture} alt="User" />
                </div>

                <p>{this.state.user.name}</p>

                <input onChange={e => this.setState({ gitUser: e.target.value })} placeholder='Repo owner' value={this.state.gitUser}/>
                <input onChange={e => this.setState({ gitRepo: e.target.value })} placeholder='Repo to star' value={this.state.gitRepo} />

                <div>
                  <button onClick={this.star}>Add star</button>
                  <button onClick={this.unstar}>Unstar</button>
                  <button onClick={this.logout}>Logout</button>
                </div>
                <div>{this.state.message}</div>
              </div>
            : <div>
                <p>Please login</p>
                <button onClick={this.login}>Login</button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
