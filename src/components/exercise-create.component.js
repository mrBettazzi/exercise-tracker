import React, { Component } from 'react';

export default class ExerciseCreate extends Component {
  constructor(props) {
    super(props);  // always in react 

    // this event binding ... always in React
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // class properties are in this.state
    // so initialization needs to happen like that (do not use 'var' or 'let')
    this.state = {
      username: '',
      description: '',
      duration: 0,
      date: new Date(),
      users: []  // initially empty, will be populated when componentDidMount
    }
  }

  componentDidMount() {
    // temporary
    this.setState({
      users: [ "mario", "antonio", "giovanni", "giovanna", "carla", "silvia", "caterina", "margherita", "mariolina" ],
      username: 'antonio'
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

  onSubmit(e) {
    e.preventDefault(); // intercept React default behaviour
    const exercise = {
      username = this.state.username,
      description = this.state.description,
      duration = this.state.duration,
      date = this.state.date
    }
    // temporary
    console.log(exercise)
  }
  
  // we're using the React datepicker component in the UI
  onChangeDate(date) {
    this.setState({
      date: date
    });
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
            <label>Duration (in minutes): </label>
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