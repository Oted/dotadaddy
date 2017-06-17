import React, { Component } from 'react';
import '../css/index.css';
import Heroes from '../heroes.json';
import * as Utils from '../utils/utils';

class MyHeroStats extends Component {
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
            won_heroes : {},
            loss_heroes : {},
            tot_heroes : {},
            winrate_heroes : {},
            score : {},
            played_heroes : new Set(),
            summary : {
                'worst' : {
                    'score' : 100,
                    'h_id' : 0
                },
                'best' : {
                    'score' : -100,
                    'h_id' : 0
                }
            }
        };

        ma.filter((m)=>{
            if (m.player_in_game) {
                const h_id = m.player_in_game.hero_id;

                self.played_heroes.add(h_id);

                self.tot_heroes[h_id] = self.tot_heroes[h_id] ? self.tot_heroes[h_id] + 1 : 1;

                if (m.did_win) {
                    self.won_heroes[h_id] = self.won_heroes[h_id] ? self.won_heroes[h_id] + 1 : 1;
                    self.loss_heroes[h_id] = self.loss_heroes[h_id] || 0;
                } else {
                    self.loss_heroes[h_id] = self.loss_heroes[h_id] ? self.loss_heroes[h_id] + 1 : 1;
                    self.won_heroes[h_id] = self.won_heroes[h_id] || 0;
                }

                self.winrate_heroes[h_id] = self.won_heroes[h_id] / self.tot_heroes[h_id];

                self.score[h_id] = self.won_heroes[h_id] > self.loss_heroes[h_id] ?
                    (self.won_heroes[h_id] / (self.loss_heroes[h_id] || 1)) * self.tot_heroes[h_id] :
                    (self.loss_heroes[h_id] / (self.won_heroes[h_id] || 1)) * self.tot_heroes[h_id] * -1;

                if (self.score[h_id] < self.summary.worst.score) {
                    self.summary.worst = {
                        'score' : self.score[h_id],
                        h_id
                    }
                }

                if (self.score[h_id] >= self.summary.best.score) {
                    self.summary.best = {
                        'score' : self.score[h_id],
                        h_id
                    }
                }
            }

            return m.did_win;
        });

        return (
            <div className="hero-list">
                <div style={{'margin-bottom':'1rem', 'font-weight':'bold'}} className="hero">
                    <img src='http://s-media-cache-ak0.pinimg.com/564x/2d/cd/80/2dcd80c6f5a21a437313adde93b373d8.jpg'/>
                    <span> Hero </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'tot_heroes')}> Total Games </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'won_heroes')}> Won Games </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'loss_heroes')}> Lost Games </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'winrate_heroes')}> Winrate </span>
                    <span className='sort-target' onClick={this._sortOn.bind(this, 'score')}> Score </span>
                </div>
                {Array.from(self.played_heroes).sort((a, b) => {
                    if (this.state.sort.direction < 0) {
                        return (self[this.state.sort.target][b] || 0) - (self[this.state.sort.target][a] || 0);
                    }

                    return (self[this.state.sort.target][a] || 0) - (self[this.state.sort.target][b] || 0);
                }).map((h_id) => {
                    return (
                        <div key={'stats-' + h_id} className="hero">
                            <img src={Heroes[h_id].img}/>
                            <span onClick={this._openHeroDetails.bind(this, h_id)} className='hero-stats sort-target'> {Heroes[h_id].localized_name} </span>
                            <span> {self.tot_heroes[h_id]} </span>
                            <span> {self.won_heroes[h_id] || 0} </span>
                            <span> {self.loss_heroes[h_id] || 0} </span>
                            <span> {(self.winrate_heroes[h_id] * 100).toFixed(2) + '%'} </span>
                            <span> {(self.score[h_id]).toFixed(0)} </span>
                        </div>
                    );
                })}
           </div>
        );
    }
}

export default MyHeroStats;
