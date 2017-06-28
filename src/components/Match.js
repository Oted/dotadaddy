import React, { Component } from 'react';
import '../css/index.css';
import * as Utils from '../utils/utils';
import Heroes from '../heroes.json';

class Match extends Component {
  constructor() {
    super();

    this.rendered = [];
  }

  componentDidMount() {
    this.props.dispatch({
      'type' : 'get_match_details',
      'id' : this.props.match.match_id
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.rendered.indexOf(nextProps.match.match_id) === -1;
  }

  _openHeroDetails(hero_id) {
    this.props.dispatch({
      'type' : 'set_modal_data',
      'data' : {
        type : 'hero_details',
        hero_id
      }
    })
  }

  render() {
    const m = this.props.match;
    const d = m.details;
    const inGame = m.player_in_game;

    if (!inGame || !m.match_id) {
      return null;
    }

    this.rendered.push(m.match_id);

    const hero = Heroes[inGame.hero_id];
    const time = new Date(m.start_time * 1000);

    return (
      <div className={m.did_win ? 'win match' : 'loss match'}>
        <div style={{'float':'right'}}>
          <span className='match-duration'> {Utils.getNiceTimeAgo(time)} </span>
          <span className='match-date'> {time.toString().split('GMT').shift().trim()} </span>
        </div>
        <img alt={hero.localized_name} src={hero.img} className='hero-image'></img>
        <span onClick={this._openHeroDetails.bind(this, inGame.hero_id)} className='hero-stats sort-target'> {hero.localized_name} </span>
        <span className='hero-stats'> {inGame.kills + ' / ' + inGame.deaths + ' / ' + inGame.assists} </span>
        <span className='hero-stats'> {inGame.last_hits + ' / ' + inGame.denies} </span>
        <span className='hero-stats'> {inGame.gold_per_min + ' / ' + inGame.xp_per_min} </span>
        <span className='match-duration'> {(d.duration / 60).toFixed(1) + ' minutes'} </span>
      </div>
    );
  }
}

export default Match;
