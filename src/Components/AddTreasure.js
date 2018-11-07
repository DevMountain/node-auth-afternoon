import React, { Component } from 'react';

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: '',
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {
    // post to add treasure

    }

  render() {
    return (
      <div className="addTreasure">
        <input type="text" placeholder="Add image URL" onChange={this.handleInput} value={this.state.treasureURL} />
        <button onClick={() => {}}>Add</button>
      </div>
    );
  }
}
