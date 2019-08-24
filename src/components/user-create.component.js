import React, { Component } from 'react';
import axios from 'axios';

export default class UserCreate extends Component {

  constructor(props) {
    super(props);  // always in react 

    // this event binding ... always in React
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // class properties are in this.state
    // so initialization needs to happen like that (do not use 'var' or 'let')
    this.state = {
      username: '',
    }
  }

 onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  
  onSubmit(e) {
    e.preventDefault(); // intercept React default behaviour
    const user = {
      username: this.state.username,
    }
    // temporary
    console.log(user);

    // hideous hard-coded URL
    axios.post('http://localhost:4202/users/add', user)
      .then(res => {
        console.log(res.data)
      });

    // (temporary) empty the field for further input
    this.setState({
      username: ''
    })
  }

  render() {
    return (
      <div>
        <h3>Create New User</h3>
        <form onSubmit={this.onSubmit}>

          <div className="form-group">
            <label>Username: </label>
            <input type="text" required className="form-control" value={this.state.username} onChange={this.onChangeUsername} />         
          </div>

          <div className="form-group">
            <input type="submit" value="Create User" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}