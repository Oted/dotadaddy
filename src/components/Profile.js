import React, { Component } from 'react';
import '../css/index.css';

class Profile extends Component {
    componentDidMount() {
        this.props.dispatch({
            'type' : 'get_match_history',
            'id' : this.props.profile.account_id
        })
    }

    render() {
        return (
            <div className="profile">
                <img src={this.props.profile.avatarfull}/>
                <span className='profile-name'> {this.props.profile.personaname} </span>
                <span className='date'> {'last online ' + new Date(this.props.profile.lastlogoff * 1000).toString().split('GMT').shift()} </span>
           </div>
        );
    }
}

export default Profile;
