import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // requires a specific stylesheet, so ...
import 'react-datepicker/dist/react-datepicker.css';

export default class ExerciseCreate extends Component {
  constructor(props) {
    super(props);  // always in react 

    // this event binding ... is always needed in React
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // class properties are in this.state
    // so initialization needs to happen like that 
    // do not use 'var' or 'let' if you want components to refresh automatically
    this.state = {
      username: '',
      description: '',
      duration: 0,
      date: new Date(),
      users: []  // initially empty, will be populated when componentDidMount
    }
  }

  componentDidMount() {
    // ReactJS lifecycle method
    // hideous fixed URL
    axios.get('http://localhost:4202/users/')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            users: res.data.map(user => user.username),
            username: res.data[0].username
          })
        } else {
        // plan B
          this.setState({
            users: [ "mario", "antonio", "giovanni", "giovanna", "carla", "silvia", "caterina", "margherita", "mariolina" ],
            username: 'antonio'
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  
  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    });
  }

  onChangeDate(date) {
    this.setState({
      date: date
    });
  }
  
  onSubmit(e) {
    e.preventDefault(); // intercept HTML default behaviour
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    }
    // temporary
    console.log(exercise);

    axios.post('http://localhost:4202/exercises/add', exercise) // hideous hard-coded URL
      .then(res => {
        console.log(res.data)
      });

    window.location ='/';
  }
  
  render() {
    return (
      <div>
        <h3>Create New Exercise Log</h3>
        <form onSubmit={this.onSubmit}>

          <div className="form-group">
            <label>Username: </label>
            <select ref="userInput" required className="form-control" value={this.state.username}
              onChange={this.onChangeUsername}>
              {
                this.state.users.map(function(user) {
                  return <option key={user} value={user}>{user}</option>;
                })
              }
            </select>
          </div>

          <div className="form-group">
            <label>Description: </label>
            <input type="text" required className="form-control" value={this.state.description} onChange={this.onChangeDescription} />         
          </div>

          <div className="form-group">
            <label>Duration (minutes): </label>
            <input type="text" required className="form-control" value={this.state.duration} onChange={this.onChangeDuration} />         
          </div>

          <div className="form-group">
            <label>Date: </label>
            <div>
              <DatePicker selected={this.state.date} onChange={this.onChangeDate} />
            </div>         
          </div>

          <div className="form-group">
            <input type="submit" value="Create Exercise Log" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}