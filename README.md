# my-exercise-tracker
This projects gathers all the info I learned following
[an online tutorial about the MERN stack](https://www.youtube.com/watch?v=7CqJlxBYj-M),
published by Beau Carnes for [freeCodeCamp](www.freecodecamp.org) on May 29, 2019.

* [prerequisites](#prerequisites)
* [backend](#app-backend)
* [frontend](#app-frontend)
* [amenities](#react-concepts)

## prerequisites
These are mandatory for ANY React project, so we better check 'em all before start :
* [mlab](https://mlab.com) account
* database initialized [here](https://mlab.com/databases/mymongo/collections)
* [Github](https://github.com/github) account
* Git project initialized [here](https://github.com/mrBettazzi/exercise-tracker)
* **node** and **npm** installed (`$ node -v`to check version)
* **create-react-app** installed
* yarn installed
* nodemon installed (`$ npm install -g nodemon`)
* Postman app installed (no `npm`, no `brew`, you must download the app from their site)
* VSCode IDE or a proper editor (I used Sublime here but I plan to install and use VSCode on the iMac also)

### kick off[^](#prerequisites)
bootstrap the React project with [Create React App](https://github.com/facebook/create-react-app)
```
npm -g uninstall create-react-app
npx create-react-app my-exercise-tracker
cd my-exercise-tracker
```
Check that everything works using `yarn start` or `npm start`.
### Git enablement[^](#prerequisites)
initialize Git components
```
git init
```
Ensure that the `.gitignore` file contains `/node_modules` `DS_Store` `dist`.
```
git add .
git remote add origin https://github.com/mrBettazzi/exercise-tracker
git commit -m "plain start"
git push -u origin msster
```

## App backend[^](#my-exercise-tracker)
I created the backend project ***inside*** the React app (not recommended for real projects).

> One big question arises when you think about making the front-end aware of the back-end URI.
> How are we going to make the back-end URI configurable for the front-end ??? **WIP**

```
mkdir backend
cd backend
npm init -y
npm install express cors mongoose dotenv
```
ensure that the `.gitignore` file contains `/backend/node_modules`.

Setup the backend environment in the `.env` file
```
DB_URI=mongodb://user:password@ds063919.mlab.com:63919/mymongo
PORT=4202
```
* [server](#basic-server)
* [database](#database-interface)
* [routing](#routing)
* [putting everything to work](#completion)

### BASIC server[^](#app-backend)
Prepare a BASIC `server.js` file to check that everything works
```
const express = require ('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log(`MongoDB database connection established successfully`);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```
Run the backend app
```
cd backend
nodemon server.js
```

### Database interface[^](#app-backend)
The models are to be written in a dedicated directory.
Models will be linked to the application using **routing**
```
mkdir backend/models
```
Prepare the `backend/models/user.model.js` with BASIC data validation :
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```
Prepare the `backend/models/exercise.model.js` file (*see how models are always more or less the same*)
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
```
### Routing[^](#app-backend)
Routing goes in a separate directory:
```
mkdir backend/routes
```
Prepare a BASIC `backend/routes/usersRouter.js` file
```
const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const newUser = new User({username});
  newUser.save()
    .then(() => res.json('User added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
```
Prepare the `backend/routes/exercisesRouter.js` file.
This file is richer and contains all the needed CRUD logic
```
const router = require('express').Router();
let Exercise = require('../models/exercise.model');

router.route('/').get((req, res) => {
  Exercise.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  const newExercise = new Exercise({
    username,
    description,
    duration,
    date  // remark trailing comma
  });

  newExercise.save()
    .then(() => res.json('Exercise added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
  Exercise.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete((req,res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json('Exercise deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req,res) => {
  Exercise.findById(req.params.id)
    .then(exercise => {
      exercise.username = req.body.username;
      exercise.description = req.body.description;
      exercise.duration = Number(req.body.duration);
      exercise.date = Date.parse(req.body.date);

      exercise.save()
        .then(() => res.json('Exercise updated'))
        .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
```

### Completion[^](#app-backend)
Complete the `server.js` file :
```
... (previous lines)

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log(`MongoDB database connection established successfully`);
})

const exercisesRouter = require('./routes/exercisesRouter');
const usersRouter = require('./routes/usersRouter');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

Now run again the backend app :
```
cd backend
nodemon server.js
```
Use Postman to test the API endpoints.
Below some invocation samples :
```
localhost:4202/users/add
{ "username": "John" }

localhost:4202/exercises/add
{ "username": "John", "description":"stay at home", "duration":"28", "date":"2019-05-23T15:14:59.000Z" }

localhost:4202/exercises

localhost:4202/exercises/update/5d5d63e48695740ad00a74f2
{ "username": "John", "description":"back on vacation", "duration":"10", "date":"2019-09-01" }

```


## App frontend[^](#my-exercise-tracker)
Make sure you have installed required components
```
npm install bootstrap react-router-dom react-datepicker axios
```
* [index.html](#index-html)
* [index.js](#index-js)
* [app.js](#app-js)
* [visual components](#components)

### index html[^](#app-frontend)
Starting point is `public/index.html`. The **root** div is where the React application will be put to use.
The original template provided by *create-react-app* was this ...
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```
We don't need manifest neither comments, so after some simplification and customization we have this :
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="exercise tracker by mrBettazzi"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Exercise Tracker</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```
### index js[^](#app-frontend)
Next important file is `src/index.js`
*IT IS CALLED IN SOME WAY THAT I DON'T YET UNDERSTAND BY REACT*.
This is the original version :
```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```
We don't need neither specific `.css` files here, nor *serviceWorker*,
so for our scope `src/index.js` is trimmed down this way :
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
```
Now comes `src/App.js` - this is the original version :
```
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```
Note that it invokes `src/App.js`.

### App js[^](#app-frontend)
In the `src/App.js` file we will break down the entire application into visual components.
In the following code : *Navbar*, *ExercisesList* etc. are all visual components.
Routing consists in matching request addresses with specific components.
The **BrowserRouter** library makes it easy to manage routing (opening and closing specific components based on the requested address)
this is how `src/App.js`looks like after initial customization :
```
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
      <Route path "/" exact component={ExercisesList} />
      <Route path "/edit/:id" component={ExerciseEdit} />
      <Route path "/create" component={ExerciseCreate} />
      <Route path "/user" component={UserCreate} />
    </Router>
  );
}

export default App;
```
### Components[^](#app-frontend)
And now we design the single React components.
* [Navigation Bar](#navbar)
* [Stub components](#stub-components)
* [Create](#create-component)
* [Edit](#edit-component)
* [List](#list-component)

#### Navbar[^](#components)
Source file is `src/components/navbar.component.js`
```
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Exercise Tracker</Link>
        <div className="navbar-collapse">
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
```
#### stub components[^](#components)
To be able to test the application we begin by putting in place fake components,
one stub component for each route defined in `App.js`.
See for instance this stub version of `src/components/exercises-list.component.js`:
```
import React, { Component } from 'react';

export default class ExercisesList extends Component {
  render() {
    return (
      <div>
        <p>You are on the Exercises List component ...</p>
      </div>
    );
  }
}
```
So that we can now test the overall behaviour of the application :
```
npm run
npm start
yarn run build
```
#### real components[^](#components)
> In React components the **constructor** should always call `super()`

> In React you never use `let` to declare variables. Variables are to be declared/defined in `Component.state` (see **constructor** below)
> front-end components use the Axios library to make XmlHttp requests to the back-end.
> the back-end can fill the response with text (*below you see that the feedback from back-end goes into the console*)
[create](#create-component)
[list](#list-component)
[edit](#edit-component)

#### create component[^](#components)
Sample `src/components/exercise-create.component.js` component file, with everything but the girl :
```
import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
// datepicker requires a specific stylesheet ...
import 'react-datepicker/dist/react-datepicker.css';

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

  onChangeDate(date) {
    this.setState({
      date: date
    });
  }

  onSubmit(e) {
    e.preventDefault(); // intercept React default behaviour
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    }
    // temporary
    console.log(exercise);

    // hideous hard-coded URL
    axios.post('http://localhost:4202/exercises/add', exercise)
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
```
Then we insert proper behaviour for the initial population of the user list (*refreshed AT EVERY RELOAD of the page*)
```
  componentDidMount() {
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
```
#### list component[^](#components)
Then we proceed to evolve the stub `src/components/exercises-list.component.js` into something more useful.
Note that the list component renders a table, so the file contains also the definition of another, separate React component for the table row (*not a class but a function*).
```
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
```
> usage of Links and anchors os not the best way here, delete should have been a button. Some refactoring suggested.

#### edit component[^](#components)
Finally we promote the `src/components/exercise-edit.component.js` component file.
> see how it's very similar to the **create component** ...
```
import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // requires a specific stylesheet, so ...
import 'react-datepicker/dist/react-datepicker.css';

export default class ExerciseEdit extends Component {
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
    // hideous fixed URL - gets current exercise
    // TODO: unserstand why props.match.params and not simply props.params
    axios.get('http://localhost:4202/exercises/'+this.props.match.params.id)
      .then(res => {
        this.setState({
          username: res.data.username,
          description: res.data.description,
          duration: res.data.duration,
          date: new Date(res.data.date)
          })
        })
      .catch(err => {
        console.log(err);
      });

    // hideous fixed URL
    axios.get('http://localhost:4202/users/')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            users: res.data.map(user => user.username),
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
    e.preventDefault(); // intercept React default behaviour
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    }
    // temporary
    console.log(exercise);

    axios.post('http://localhost:4202/exercises/update/'+this.props.match.params.id, exercise) // hideous hard-coded URL
      .then(res => {
        console.log(res.data)
      });

    window.location ='/';
  }

  render() {
    return (
      <div>
        <h3>Edit Exercise</h3>
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
            <input type="submit" value="Update Exercise" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}
```


# React concepts[^](#my-exercise-tracker)
## a basic Component
(This is what I want to see on the screen)
The pseudo-HTML is JSX, a Javascript dialect that is unbeknownst by the browser.

JSX parts must be transpiled and end up as Javascript code.
JSX allows to embed simple Javascript between curly braces {} - only values not functions.

```
class ShoppingList extends React.Component {
  render () {
    return(
      <div classname="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Cereal</li>
          <li>Milk</li>
        </ul>
      </div>
    );
  }
}
```
This component can be used in an HTML page :
```
<ShoppingList name="Paolo" />
```

## previous text from **create-react-app**
### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
