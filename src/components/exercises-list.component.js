import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// this file hosts here an additional React component
// and this is a Functional React Component (suggested method since React Hooks, indeed)
// Functional React components lacked state and constructor methods ...
const Exercise = (props) => (
      <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0,10)}</td>
        <td>
          <Link to={"/edit/"+props.exercise._id}>edit</Link> | 
          <a href="#" onClick={ () => { props.deleteExercise(props.exercise._id) } }> delete</a>
        </td>
      </tr>
)

// resuming here the straight exercises-list component
export default class ExercisesList extends Component {
  constructor(props) {
    super(props);  // always in react 

    // this event binding ... always in React
    this.deleteExercise = this.deleteExercise.bind(this);

    // class properties are in this.state
    this.state = { exercises: [] }
  }

  componentDidMount() {
    axios.get('http://localhost:4202/exercises/')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ exercises: res.data })  // everything including telemetry fields ...
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteExercise(id) {
    axios.delete('http://localhost:4202/exercises/delete/' + id)
      .then(res => console.log(res.data));
    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(singleExercise => {
      return <Exercise exercise={singleExercise} deleteExercise={this.deleteExercise} key={singleExercise._id} />;
    })
  }

  render() {
    return (
      <div>
        <h1>Logged Exercises ...</h1>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.exerciseList() }
          </tbody>
        </table>
      </div>
    );
  }
}