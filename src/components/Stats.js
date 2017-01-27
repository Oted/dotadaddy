import React, { Component } from 'react';
import '../css/index.css';
import * as Utils from '../utils/utils';
import Heroes from '../heroes.json';

class Stats extends Component {

    _closeModal() {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {}
        })
    }

    render() {
        if (!this.props.matches.length || this.props.matches.filter((m) => {
            return m.details ? true : false;
        }).length < 1) {
            return null;
        }

        let played_heroes = new Set();
        let tot_heroes = {};
        let winning_hero = {
            'total' : 0,
            'id' : null
        };

        const matches = this.props.matches;
        const wonMatches = this.props.matches.filter((m)=> {
            if (m.player_in_game) {
                const h_id = m.player_in_game.hero_id;
                played_heroes.add(m.player_in_game.hero_id);

                tot_heroes[h_id] = tot_heroes[h_id] ? tot_heroes[h_id] + 1 : 1;

                if (tot_heroes[h_id] > winning_hero.total) {
                    winning_hero.total = tot_heroes[h_id];
                    winning_hero.id = h_id;
                }
            }

            return m.did_win;
        });

        const winRate = (wonMatches.length / matches.length * 100).toFixed(2);
        let col = 'green';
        let mmr = ((matches.length / 2).toFixed(0) - wonMatches.length) * 25;

        if (winRate < 50) {
            col = 'red';
        }

        return (
            <div className="stats">
                <span>
                    <span> {'Between ' + Utils.niceDate(matches[matches.length - 1].start_time) + ' and ' + Utils.niceDate(matches[0].start_time)} </span>
                    {'you played ' + this.props.matches.length + ' matches' + '. You won'}
                    <span style={{'color' : col}}> {winRate + '%'} </span>
                    <span> of them. </span>
                    <span> { mmr > 0 ? 'and lost around ' : 'and gained around '} </span>
                    <span style={{'color' : col}}> { Math.abs(mmr) } </span>
                    <span> {' mmr.'} </span>
                    <span> {'You played ' + played_heroes.size + ' different heroes'}</span>
                    <span>, with the most played being </span>
                    <span> {Heroes[winning_hero.id].localized_name  + ' with ' + winning_hero.total + ' games played.' } </span>
                </span>
           </div>
        );
    }
}

export default Stats;
