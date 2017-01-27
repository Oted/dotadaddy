import React, { Component } from 'react';
import '../css/index.css';

class SteamId extends Component {
    _keyDown = (e) => {
        if (e.which === 13) {
            if (e.target.value.length < 5) {
                return;
            }

            this.props.dispatch({
                type: 'fetch_steam_profile',
                id: e.target.value
            });
        }
    }

    render() {
        return (
          <div className="fetch-steam-id">
            <span> In order to begin, pls fill in your steam_id </span>
            <input
                autoFocus='true'
                onKeyDown={this._keyDown}
                type='text'
                value='76561198106128250'
            />
          </div>
        );
    }
}

export default SteamId;
