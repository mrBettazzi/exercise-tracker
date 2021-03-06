import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/about" className="navbar-brand">Exercise Tracker</Link>
        <div className="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item"><Link to="/" className="nav-link">List Exercises</Link></li>
            <li className="navbar-item"><Link to="/list" className="nav-link">Paginate Exercises</Link></li>
            <li className="navbar-item"><Link to="/create" className="nav-link">Create Exercise</Link></li>
            <li className="navbar-item"><Link to="/user" className="nav-link">Create User</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}