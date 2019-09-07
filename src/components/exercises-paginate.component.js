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
export default class ExercisesPaginate extends Component {
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
  
  onInitialSearch = (e) => {
    e.preventDefault();
    const { value } = this.input;
    if (value === '') {
      // return;
      this.componentDidMount()
    } else {
      axios.get('http://localhost:4202/exercises/list?description=' + value)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ exercises: res.data })  // everything including telemetry fields ...
        }
      })
      .catch(err => {
        console.log(err);
      });      
    }
    // this.fetchStories(value, 0);
  }

  /*
  
  const getHackerNewsUrl = (value, page) => ({
    `https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=100`
  })
  
  fetchStories = (value, page) => fetch(getHackerNewsUrl(value, page))
    .then(response => response.json())
    .then(result => this.onSetResult(result, page));

  
  const onSetResult = (result, page) => ({
    page === 0 ? this.setState(applySetResult(result)) : this.setState(applyUpdateResult(result))
  });

  const applySetResult = (result) => (prevState) => ({
    hits: result.hits,
    page: result.page,
  });

  const applyUpdateResult = (result) => (prevState) => ({
    hits: [...prevState.hits, ...result.hits],
    page: result.page,
  });

  */
 
  render() {
    return (
      <div>
        <h1>Proper List ...</h1>
        <div className="page">
          <div className="interactions">
            <form type="submit" onSubmit={this.onInitialSearch}>
              <input type="text" ref={node => this.input = node} />
              <button type="submit">Search</button>
            </form>
          </div>
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
      </div>
    );
  }
}