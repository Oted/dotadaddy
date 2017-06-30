import React, { Component } from 'react';
import '../css/index.css';

class Loading extends Component {
  render() {
    const d = this.props.matches.filter((m) => {
      return m.player_in_game;
    }).length / this.props.filtered.length;

    return (
      <div
        className='loading-bar'
        style={{'width': d * 100 + '%'}}>
      </div>
    );
  }
}

export default Loading;
