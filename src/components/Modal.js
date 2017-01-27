import React, { Component } from 'react';
import '../css/index.css';
import MyHeroStats from './MyHeroStats';
import TeamHeroStats from './TeamHeroStats';
import OpponentHeroStats from './OpponentHeroStats';
import HeroDetails from './HeroDetails';

class Modal extends Component {
    _closeModal() {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {}
        })
    }

    _openMyHeroModal() {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {
                'type' : 'my_hero_overview'
            }
        })
    }

    _openTeamHeroesModal() {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {
                'type' : 'team_heroes'
            }
        })
    }

    _openOpponentHeroesModal() {
        return this.props.dispatch({
            'type' : 'set_modal_data',
            'data' : {
                'type' : 'opponent_heroes'
            }
        })
    }

    _decideModal(data) {
        switch (data.type) {
            case "my_hero_overview" :
                return (
                    <MyHeroStats
                        matches={this.props.matches}
                        dispatch={this.props.dispatch}
                    />
                );
            case "team_heroes" :
                return (
                    <TeamHeroStats
                        matches={this.props.matches}
                        dispatch={this.props.dispatch}
                    />
                );
            case "opponent_heroes" :
                return (
                    <OpponentHeroStats
                        matches={this.props.matches}
                        dispatch={this.props.dispatch}
                    />
                );
            case "hero_details" :
                return (
                    <HeroDetails
                        matches={this.props.matches}
                        data={this.props.data}
                        dispatch={this.props.dispatch}
                    />
                );
        }
    }

    render() {
        if (!this.props.data || !this.props.data.type) {
            return (
                <div >
                    <div className="modal-fleak" onClick={this._openMyHeroModal.bind(this)}>
                        <span> performance </span>
                    </div>
                    <div className="modal-fleak"  style={{"top": "5rem"}} onClick={this._openTeamHeroesModal.bind(this)}>
                        <span> teammates </span>
                    </div>
                    <div className="modal-fleak"  style={{"top": "8rem"}} onClick={this._openOpponentHeroesModal.bind(this)}>
                        <span> opponents </span>
                    </div>
                    <div id="modal" className="modal-hidden"></div>
                </div>
            )
        }

        return (
            <div>
                <div id="modal" className="modal-show">
                    <div className="modal-close" onClick={this._closeModal.bind(this)}>
                        <span> ❌  </span>
                    </div>
                    {this._decideModal(this.props.data)}
                </div>
                <div id="modal-overlay" onClick={this._closeModal.bind(this)}></div>
            </div>
        );
    }
}

export default Modal;
