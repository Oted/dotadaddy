import React, { Component } from 'react';
import '../css/items.css';

class Item extends Component {
    componentDidMount() {

    }

    render() {
        return (
          <div className="item">
            <img src={this.props.item.data}/>
            <a className='item-title' href={this.props.item.source} target='_blank'> {this.props.item.title} </a>
          </div>
        );
    }
}

export default Item;
