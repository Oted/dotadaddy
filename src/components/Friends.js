import React, { Component } from 'react';
import '../css/index.css';
import * as Utils from '../utils/utils';
import Friend from './Friend';

class Friends extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="friend-container">
        {Object.keys(this.props.friend_ids).map((key) => {
          return <Friend
            key={key}
            id={key}
            count={this.props.friend_ids[key]}
            friend={this.props.friends[key]}
            dispatch={this.props.dispatch}
            profile={this.props.profile}
          />
        })}
      </div>
    );
  }
}

export default Friends;
