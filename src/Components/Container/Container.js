import React, { Component } from 'react';
import axios from 'axios';
import './Container.css';
import Treasure from '../Treasure';

export default class Container extends Component {
  constructor() {
    super();
    this.state = {
      treasures: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ treasures: {} });
    }
  }

  getDragonTreasure() {
    // axios GET to /api/treasure/dragon here
  }

  getAllTreasure() {
    // axios GET to /api/treasure/all here
  }

  getMyTreasure() {
    // axios GET to /api/treasure/user here
  }

  addMyTreasure() {
    // axios POST to /api/treasure/user here
  }

  render() {
    const { username } = this.props.user;
    const { dragon, user, all } = this.state.treasures;
    return (
      <div className="Container">
        {dragon ? (
          <div className="treasureBox loggedIn">
            <h1>Dragon's treasure</h1>
            <Treasure treasure={dragon} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getDragonTreasure()}>
              See Dragon's <br /> Treasure
            </button>
            <p>This treasure trove does not require a user to be logged in for access</p>
          </div>
        )}
        {user && username ? (
          <div className="treasureBox loggedIn">
            <h1>
              {this.props.user.username}
              's treasure
            </h1>
            <Treasure treasure={user} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getMyTreasure()} name="user">
              See My <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be logged in for access</p>
          </div>
        )}
        {all && username ? (
          <div className="treasureBox loggedIn">
            <h1>All treasure</h1>
            <Treasure treasure={all} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={() => this.getAllTreasure()} name="all">
              See All <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be a logged in as an admin user for access</p>
          </div>
        )}
      </div>
    );
  }
}
