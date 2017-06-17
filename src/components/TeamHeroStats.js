import React, { Component } from 'react';
import '../css/index.css';
import Heroes from '../heroes.json';
import * as Utils from '../utils/utils';

class TeamHeroStats extends Component {
    constructor() {
        super();

        this.state = {
            'sort' : {
                'target' : 'score',
                'direction' : -1
            }
        };
    }

    shouldComponentRender() {
        return true;
    }

    _sortOn(target) {
        this.setState({
            'sort' : {
                'target' : target,
                'direction' : this.state.sort.target === target ? this.state.sort.direction * -1 : -1
            }
        });
    }

    _openHeroDetails(hero_id) {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {
                type : 'hero_details',
                hero_id
            }
        })
    }

    render() {
        const ma = this.props.matches;
        let self = {
            won_with : {},
            won_with_rate : {},
            lost_with : {},
            lost_with_rate : {},
            in_team : {},
            score : {},
            tot_heroes : new Set()
        };

        ma.forEach((m)=> {
            if (m.player_in_game) {
                m.teammates.forEach((p) => {
                    const h_id = p.hero_id;
                    self.tot_heroes.add(h_id);
                    self.in_team[h_id] = self.in_team[h_id] ? self.in_team[h_id] + 1 : 1;

                    if (m.did_win) {
                        self.won_with[h_id] = self.won_with[h_id] ? self.won_with[h_id] + 1 : 1;
                    } else {
                        self.lost_with[h_id] = self.lost_with[h_id] ? self.lost_with[h_id] + 1 : 1;
                    }

                    self.lost_with_rate[h_id] = (self.lost_with[h_id] || 0) / self.in_team[h_id];
                    self.won_with_rate[h_id] = (self.won_with[h_id] || 0) / self.in_team[h_id];

                    if (self.won_with[h_id]) {
                        if (!self.lost_with[h_id]) {
                            self.score[h_id] = self.won_with[h_id];
                        } else {
                            self.score[h_id] = self.won_with[h_id] / self.lost_with[h_id];
                        }
                    } else if (self.lost_with[h_id]) {
                        if (!self.won_with[h_id]) {
                            self.score[h_id] = self.lost_with[h_id] * -1;
                        } else {
                            self.score[h_id] = (self.won_with[h_id] / self.lost_with[h_id]) * -1;
                        }
                    }
                });
            }
        });

        const sorted = Array.from(self.tot_heroes).sort((a, b) => {
            return self.score[b] - self.score[a];
        });

        return (
            <div className="hero-list">
                <div style={{'margin-bottom':'1rem', 'font-weight':'bold'}} className="hero">
                    <img src='http://s-media-cache-ak0.pinimg.com/564x/2d/cd/80/2dcd80c6f5a21a437313adde93b373d8.jpg'/>
                    <span> Hero </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'in_team')}> In Team </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'won_with_rate')}> Won With Rate </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'lost_with_rate')}> Lost With Rate </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'score')}> Score </span>
                </div>
                {Array.from(self.tot_heroes).sort((a, b) => {
                    let res;
                    if (this.state.sort.direction < 0) {
                        res = (self[this.state.sort.target][b] || 0) - (self[this.state.sort.target][a] || 0);
                    } else {
                        res = (self[this.state.sort.target][a] || 0) - (self[this.state.sort.target][b] || 0);
                    }

                    return res === 0 ? self.in_team[b] - self.in_team[a] : res;
                }).map((h_id) => {
                    return (
                        <div key={'team-' + h_id} className="hero">
                            <img alt={Heroes[h_id].localized_name} src={Heroes[h_id].img}/>
                            <span onClick={this._openHeroDetails.bind(this, h_id)} className='hero-stats sort-target'> {Heroes[h_id].localized_name} </span>
                            <span> {self.in_team[h_id] || 0} </span>
                            <span> {((self.won_with_rate[h_id] || 0) * 100).toFixed(2) + '%'} </span>
                            <span> {((self.lost_with_rate[h_id] || 0) * 100).toFixed(2) + '%'} </span>
                            <span> {self.score[h_id].toFixed(2)} </span>
                        </div>
                    );
                })}
           </div>
        );
    }
}

export default TeamHeroStats;
