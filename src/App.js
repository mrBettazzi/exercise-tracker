import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar         from "./components/navbar.component";
import ExercisesList  from "./components/exercises-list.component";
import ExerciseEdit   from "./components/exercise-edit.component";
import ExerciseCreate from "./components/exercise-create.component";
import UserCreate     from "./components/user-create.component";

function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <Route path="/" exact component={ExercisesList} />
      <Route path="/edit/:id" component={ExerciseEdit} />
      <Route path="/create" component={ExerciseCreate} />
      <Route path="/user" component={UserCreate} />
    </Router>
  );
}

export default App;
