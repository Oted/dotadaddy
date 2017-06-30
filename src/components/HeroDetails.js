import React, { Component } from 'react';
import '../css/index.css';
import Heroes from '../heroes.json';
import Matches from './Matches';
import * as Utils from '../utils/utils';

class HeroDetails extends Component {
  constructor() {
    super();

    this.state = {
      'active' : 'played'
    };
  }

  shouldComponentRender() {
    return true;
  }

  _buildSelf(h_id) {
    let in_opponents = [];
    let in_team = [];
    let played = [];

    this.props.matches.forEach((m) => {
      if (!m.player_in_game) {
        return;
      }

      let found = false;

      m.opponents.forEach((o) => {
        if (o.hero_id === h_id) {
          in_opponents.push(m);
          found = true;
          return;
        }
      });

      if (found) {
        return;
      }

      m.teammates.forEach((t) => {
        if (t.hero_id === h_id) {
          in_team.push(m);
          found = true;
          return;
        }
      });

      if (!found && m.player_in_game.hero_id === h_id) {
        played.push(m);
      }
    });

    return {
      in_opponents,
      in_team,
      played
    }
  }

  _generateSummary(hero, matches) {
    if (!matches || !matches.length) {
      return null;
    }

    let self = {
      'avg_gpm' : 0,
      'avg_lh' : 0,
      'avg_xpm' : 0,
      'avg_kills' : 0,
      'avg_deaths' : 0
    }

    const wins = matches.filter((m) => {
      self.avg_gpm += m.player_in_game.gold_per_min;
      self.avg_lh += m.player_in_game.last_hits;
      self.avg_xpm += m.player_in_game.xp_per_min;
      self.avg_kills += m.player_in_game.kills;
      self.avg_deaths += m.player_in_game.deaths;
      return m.did_win;
    });

    return (<div>
      <span className='details-stats'>
        {'win rate ' + ((wins.length / matches.length) * 100).toFixed(0) + '%'}
      </span>
      {Object.keys(self).map((key) => {
        return (
          <span className='details-stats'>
            {key.replace('avg_', 'average ') + ' : ' + (self[key] / matches.length).toFixed(0)}
          </span>
        );
      })}
    </div>);
  }

  render() {
    const h_id = this.props.data.hero_id;
    const hero = Heroes[h_id];
    let self = this._buildSelf(h_id);
    const ma = self[this.state.active];

    return (
      <div className="hero-details">
        <span> {hero.localized_name} </span>
        <img src={hero.img.replace('_sb', '_lg')} />
        <div>
          {this._generateSummary(hero, ma)}
        </div>
        <div className='hero-details-match-select'>
          {self.played.length ? <span
            className={this.state.active === 'played' ? 'sort-target active' : 'sort-target'}
            onClick={this.setState.bind(this, {'active' : 'played'})}>
            {'played ' + self.played.length + ' times'}
          </span> : <span> {'played ' + self.played.length + ' times'} </span>}
          {self.in_opponents.length ? <span
            className={this.state.active === 'in_opponents' ? 'sort-target active' : 'sort-target'}
            onClick={this.setState.bind(this, {'active' : 'in_opponents'})}>
            {'met ' + self.in_opponents.length + ' times'}
          </span> : <span> {'in apponent team ' + self.in_opponents.length + ' times'} </span>}
          {self.in_team ? <span
            className={this.state.active === 'in_team' ? 'sort-target active' : 'sort-target'}
            onClick={this.setState.bind(this, {'active' : 'in_team'})}>
            {'played with ' + self.in_team.length + ' times'}
          </span> : <span> {'in team ' + self.in_team.length + ' times'} </span>}
        </div>
        <Matches
          dispatch={() => {console.log('tried to dispatch', arguments)}}
          matches={ma}
        />
      </div>
    );
  }
}

export default HeroDetails;
