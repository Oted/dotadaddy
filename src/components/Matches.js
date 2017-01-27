import React, { Component } from 'react';
import '../css/index.css';
import Match from './Match.js';

class Matches extends Component {
    constructor() {
        super();

        this.state = {
            "sort" : {
                "key" : "start_time",
                "sign" : 1
            }
        }
    }

    _setSort(key, sign) {
        if (this.state.sort.key === key) {
            return this.setState({
                "sort" : {
                    key,
                    sign : this.state.sort.sign * -1
                }
            })
        }

        return this.setState({
            "sort" : {
                key,
                sign : typeof sign === "number" ? sign : 1
            }
        })
    }

    render() {
        if (!this.props.matches || !this.props.matches.length) {
            return (<div className="matches"> Loading... </div>);
        }

        return (
            <div className="matches">
                <div>
                    <div className='match game-sort'>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.hero_id")}> Hero </span>
                        </div>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.kills")}> K </span>
                            <span> / </span>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.deaths")}> D </span>
                            <span> / </span>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.assists")}> A </span>
                        </div>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.last_hits")}> LH </span>
                            <span> / </span>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.denies")}> DE </span>
                        </div>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.gold_per_min")}> GPM </span>
                            <span> / </span>
                            <span className='sort-target' onClick={this._setSort.bind(this, "player_in_game.xp_per_min")}> XPM </span>
                        </div>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "details.duration")}> duration </span>
                        </div>
                        <div>
                            <span className='sort-target' onClick={this._setSort.bind(this, "details.start_time")}> date </span>
                        </div>
                    </div>
                    {this.props.matches.sort((a, b) => {
                        const s = this.state.sort;
                        let ss = s.key.split('.');
                        let res;

                        //work with the dot notation to be able to reach into deep objects
                        if (ss.length > 1) {
                            if (!a.player_in_game || !b.player_in_game) {
                                return 0;
                            }

                            let v1 = a;
                            let v2 = b;
                            let key;

                            //while its not the last key keep reasing inwards
                            while (ss.length > 0) {
                                key = ss.shift();
                                v1 = v1[key];
                                v2 = v2[key];
                            }

                            res = s.sign < 0 ? v1 - v2 : v2 - v1;
                        } else {
                            res = s.sign < 0 ? a[s.key] - b[s.key] : b[s.key] - a[s.key];
                        }

                        //if the sort values are eq, then sort on date;
                        return res === 0 ? b.start_time - a.start_time : res;
                    }).map((m) => {
                        return <Match
                            dispatch={this.props.dispatch}
                            match={m}
                        />
                    })}
                </div>
            </div>
        );
    }
}

export default Matches;
