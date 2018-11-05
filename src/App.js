import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header'
import Container from './Components/Container/Container'

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: {}
    }
    this.updateUser = this.updateUser.bind(this);
  }
  updateUser () {
    // this should update the user property on state
  }
  render() {
    return (
      <div className="App">
        <Header user={this.state.user} updateUser={this.updateUser}/>
        <Container user={this.state.user}/>
      </div>
    );
  }
}

export default App;
