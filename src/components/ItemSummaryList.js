import React, { Component } from 'react';
import '../css/index.css';
import Items from '../items.json';

/**
 *  Modal to show a set of items given matches,
 *  if no id is given the items will be displayed from the player_in_game
 *  if a account_id is given the user will be used for every match
 *  if a hero_id is given the user playing that hero will be used for every match
 */
class ItemSummaryList extends Component {
    constructor() {
        super();
    }

    render() {
        if (!this.props.matches || !this.props.matches.length) {
            return (<div className="items"> Loading... </div>);
        }

        const self = {
            'item_count' : {}
        };

        return (
            <div className="items">
                {this.props.matches.map((m) => {
                    const target = this._decideTargetInMatch(m);
                    return (
                        <div>
                            {target.item_0 ? <div className='item'>
                                <img src={Items[target.item_0].img}/>
                                <span> {Items[target.item_0].key} </span>
                            </div> : null}
                            {target.item_1 ? <div className='item'>
                                <img src={Items[target.item_1].img}/>
                                <span> {Items[target.item_1].key} </span>
                            </div> : null}
                            {target.item_2 ? <div className='item'>
                                <img src={Items[target.item_2].img}/>
                                <span> {Items[target.item_2].key} </span>
                            </div> : null}
                            {target.item_3 ? <div className='item'>
                                <img src={Items[target.item_3].img}/>
                                <span> {Items[target.item_3].key} </span>
                            </div> : null}
                            {target.item_4 ? <div className='item'>
                                <img src={Items[target.item_4].img}/>
                                <span> {Items[target.item_4].key} </span>
                            </div> : null}
                            {target.item_5 ? <div className='item'>
                                <img src={Items[target.item_5].img}/>
                                <span> {Items[target.item_5].key} </span>
                            </div> : null}
                        </div>
                    );
                })}
            </div>
        );
    }

    _decideTargetInMatch(m) {
        if (this.props.account_id) {
            if (this.props.account_id === m.player_in_game.account_id) {
                return m.player_in_game;
            }

            return [...m.opponents, ...m.teammates].filter((u) => {
                return u.account_id === u.account_id;
            })[0];
        }

        if (this.props.hero_id) {
            if (this.props.hero_id === m.player_in_game.hero_id) {
                return m.player_in_game;
            }

            return [...m.opponents, ...m.teammates].filter((u) => {
                return u.hero_id === u.hero_id;
            })[0];
        }

        return m.player_in_game;
    }
}

export default ItemSummaryList;
