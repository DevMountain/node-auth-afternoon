import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header'
import Container from './Components/Container/Container'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Container />
      </div>
    );
  }
}

export default App;
