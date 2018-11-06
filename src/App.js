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
  updateUser () {
    // this should update the user property on state
  }
  render() {
    return (
      <div className="App">
        <Header user={{}} updateUser={()=>{}}/>
        <Container user={{}}/>
      </div>
    );
  }
}

export default App;
