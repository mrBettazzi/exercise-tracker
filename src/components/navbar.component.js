import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  (method) Navbar.render(): JSX.element
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Tracker</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item"><Link to="/" className="nav-link">List Exercises</Link></li>
            <li className="navbar-item"><Link to="/create" className="nav-link">Exercise Log</Link></li>
            <li className="navbar-item"><Link to="/user" className="nav-link">Create User</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}