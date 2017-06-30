import React, { Component } from 'react';
import '../css/index.css';
import * as Utils from '../utils/utils';

class Friend extends Component {
  _clickFriend(id) {
    this.props.dispatch({
      type: 'fetch_steam_profile',
      id
    });
  }

  componentDidMount() {
    this.props.dispatch({
      'type' : 'get_friend_profile',
      'id' : this.props.id
    });
  }

  render() {
    if (!this.props.friend) {
      return null;
    }

    return (
      <div className="friend-image">
        <span> {this.props.friend.personaname} </span>
        <img
          className={this.props.friend.personastate > 0 ? "online-border" : "offline-border"}
          src={this.props.friend.avatarmedium}
          data-tooltip={this.props.friend.personaname}
          onClick={this._clickFriend.bind(this, this.props.friend.steamid)}
        />
      </div>
    );
  }
}

export default Friend;
