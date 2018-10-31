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
  }
  updateUser= (username, isAdmin) => {
    this.setState({user:{username, isAdmin}})
  }
  render() {
    return (
      <div className="App">
        <Header updateUser={this.updateUser} user={this.state.user}/>
        <Container user={this.state.user}/>
      </div>
    );
  }
}

export default App;
