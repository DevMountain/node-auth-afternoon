import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import Container from './Components/Container/Container';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
    };
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(user) {
    this.setState({
      user,
    });
  }

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        <Header user={user} updateUser={this.updateUser} />
        <Container user={user} />
      </div>
    );
  }
}

export default App;
