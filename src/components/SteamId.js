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
    if (this.props.error) {
      return (
        <div> There was an error retrieving the profile, please check that the steam id is right and that your data is public in your dota and steam profile </div>
      );
    }

    return (
      <div className="landing">
        <div className="top">
          <img src="http://cdn.gamer-network.net/2013/usgamer/dota2header.jpg"/>
        </div>
        <h2> Welcome to Dotadaddy </h2>
        <div className='intro'>
          <span> In order to use this app you have to enable "Expose Public Match Data" setting in the Dota 2 game client. </span>
          <img src="http://preview.ibb.co/hQ4bdQ/dota_profile.png" alt="dota_profile" border="0"/>
          <span>  Your steam profile also has to be set to public. </span>
          <img src="http://preview.ibb.co/hQ4bdQ/dota_profile.png" alt="dota_profile" border="0"/>
          <span> Once your data is available, please locate your steam id in the steam client  and fill it in below (this only has to be done once), if you need additional help locating your steam id, please click <a target="_blank" href="https://support.steampowered.com/kb_article.php?ref=1558-QYAX-1965">here</a>
          </span>
          <img src="http://preview.ibb.co/eh9bdQ/steam_id.png" alt="steam_id" border="0"/>
        </div>
        <div className="fetch-steam-id">
          <span> Please fill in your steam id </span>
          <input
            autoFocus='true'
            onKeyDown={this._keyDown}
            type='text'
          />
        </div>
      </div>
    );
  }
}

export default SteamId;
