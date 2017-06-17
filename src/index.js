import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/index.css';
import {Observable} from 'rxjs';
import {handleAction, dispatch} from './utils/actions';
import * as Api from './utils/Api';
import * as Utils from './utils/utils';

const initialState = {
    'profile' : null,
    'matches' : {},
    'filtered' : [],
    'modal_data' : {},
    'stats' : {
        'win' : 0,
        'loss' : 0
    },
    'filters' : {
        'lobby_types' : [7]
    }
};

const stateUpdate$ = Observable.merge(
    handleAction('set_filter_dates')
    .map(data => state => ({
        ...state,
        filters: {
            'dates' : Object.assign({}, data)
        }
    })),
    handleAction('fetch_steam_profile')
    .switchMap(act => {
        return Api.getSteamProfile(act.id);
    })
    .map(data => state => ({
        ...state,
        profile: Object.assign({}, {'account_id' : Utils.convert(data.steamid)}, data)
    })),
    handleAction('get_match_history')
    .switchMap(act => {
        return Api.getMatchHistory(act.id);
    })
    .map(data => state => ({
        ...state,
        matches: data,
        filters: {
            dates : Object.assign({}, {
                max:data.matches[0].start_time * 1000,
                min:data.matches[data.matches.length - 1].start_time * 1000
            })
        },
        filtered : data.matches.filter((m) => {
            return state.filters.lobby_types.indexOf(m.lobby_type) > -1;
        })
    })),
    handleAction('set_modal_data')
    .map(data => state => ({
       ...state,
       modal_data: Object.assign({}, data.data)
    })),
    handleAction('get_match_details')
    .mergeMap(act => {
        return Api.getMatchDetails(act.id);
    })
    .map(data => state => {
        const newMatches = state.matches.matches.reduce((arr, m) => {
            if (m.match_id === data.match_id) {
                m.player_in_game = Utils.findPlayerInGame(state.profile.account_id, data);

                if (!m.player_in_game) {
                    return arr;
                }

                m.did_win = Utils.didWin(state.profile.account_id, m.player_in_game, data);
                m.details = data;
                m.opponents = [];
                m.teammates = []

                data.players.forEach((p) => {
                    if (m.player_in_game.account_id === p.account_id) {
                        return;
                    }

                    p.player_slot.toString().length === m.player_in_game.player_slot.toString().length ?
                        m.teammates.push(p) :
                        m.opponents.push(p)
                });

                delete m.players;
                return arr.concat(m);
            }

            return arr.concat(m);
        }, []);

        return {
            ...state,
            matches: Object.assign({}, state.matches, {'matches' : newMatches})
        }
    })
);

const appState$ = Observable
    .of(initialState)
    .merge(stateUpdate$)
    .scan((state, patch) => {
        return patch(state)
    });

appState$.subscribe(state => {
    ReactDOM.render(
        <App {...state} dispatch={dispatch} />,
        document.getElementById('root')
    );
}, error => {
    console.log('ERRR', error);
    throw error;
});
