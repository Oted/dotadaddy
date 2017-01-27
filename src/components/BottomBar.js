import React, { Component } from 'react';
import InputRange from 'react-input-range';
import * as Utils from '../utils/utils';
import '../css/index.css';
import '../../node_modules/react-input-range/dist/react-input-range.css';

class BottomBar extends Component {
    constructor(props) {
        super(props);
    }

    _handleValuesChange(component, data) {
        return this.props.dispatch({
            'type':'set_filter_dates',
            data
        });
    }

    render() {
        const ma = this.props.matches;
        const fi = this.props.filtered;
        const filters = this.props.filters;

        if (!ma || !ma.length || !filters) {
            return null;
        }

        return (
            <div className="bottom-bar">
                <InputRange
                    minValue={ma[ma.length - 1].start_time * 1000}
                    className='input-range'
                    maxValue={ma[0].start_time * 1000}
                    value={filters.dates}
                    onChange={this._handleValuesChange.bind(this)}
                    formatLabel={(v) => {return Utils.niceDate(v / 1000)}}
                />
            </div>
        );
    }
}

export default BottomBar;
