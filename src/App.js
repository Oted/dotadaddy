
import './css/App.css';
import React, { Component } from 'react';
import SteamId from './components/SteamId';
import Profile from './components/Profile';
import Stats from './components/Stats';
import Matches from './components/Matches';
import Modal from './components/Modal';
import Loading from './components/Loading';
import Friends from './components/Friends';
import BottomBar from './components/BottomBar';

class App extends Component {
  componentDidMount() {
    this.id = localStorage.getItem("steamid");

    if (this.id) {
      this.props.dispatch({
        type: 'fetch_steam_profile',
        id : this.id
      });
    }
  }

  render() {
    return (<div className="App">
      {!this.props.profile ?
        this.id ? null : <SteamId dispatch={this.props.dispatch}/> :
        <div>
          <Friends
            dispatch={this.props.dispatch}
            profile={this.props.profile}
            friends={this.props.friends}
            friend_ids={this.props.friend_ids}
            stats={this.props.stats}
          />
          <Modal
            dispatch={this.props.dispatch}
            matches={this.props.filtered || []}
            data={this.props.modal_data}
          />
          <div className='top-nav'>
            <Profile
              dispatch={this.props.dispatch}
              profile={this.props.profile}
              stats={this.props.stats}
            />
            <Loading
              filtered={this.props.filtered || []}
              matches={this.props.matches.matches || []}
            />
            <Stats
              dispatch={this.props.dispatch}
              matches={this.props.filtered || []}
            />
          </div>
          <Matches
            dispatch={this.props.dispatch}
            matches={this.props.filtered || []}
            profile={this.props.profile}
          />
       </div>
      }
    </div>)
  }
}

export default App;
