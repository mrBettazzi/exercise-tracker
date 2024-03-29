# my-exercise-tracker
This projects gathers all the info I learned following
[an online tutorial about the MERN stack](https://www.youtube.com/watch?v=7CqJlxBYj-M),
published by Beau Carnes for [freeCodeCamp](https://www.freecodecamp.org) on May 29, 2019.

* [prerequisites](#prerequisites)
* [backend](#app-backend)
* [frontend](#app-frontend)
* [amenities](#react-concepts)

## prerequisites
These are mandatory for ANY React project, so we better check 'em all before start :
* [mlab](https://mlab.com) account (abandoned 2020)
 or * [mongo atlas](https://cloud.mongodb.com) account
* *mymongo* database initialized [here](https://cloud.mongodb.com/v2/5f5e09744e71c271bb765d8b#clusters)
* [Github](https://github.com/github) account
* Git project initialized [here](https://github.com/mrBettazzi/exercise-tracker)
* **node** and **npm** installed (`$ node -v`to check version)
* **create-react-app** installed
* yarn installed
* nodemon installed (`$ npm install -g nodemon`)
* Postman app installed (no `npm`, no `brew`, you must download the app from their site)
* VSCode IDE or a proper editor (I used Sublime here but I plan to install and use VSCode on the iMac also)

### kick off[^](#prerequisites)
bootstrap the React project with [Create React App](https://github.com/facebook/create-react-app).
* remove any global `create-react-app` installation
* use `npx` not `npm` to bootstrap the project.
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

## Database connection[^](#prerequisites)
Pocure Mongo Atlas connection string
```
https://cloud.mongodb.com
```
Clusters > Sandbox > Connect : copy and paste the connection string from **Connect your Application** somewhere. 

## App backend[^](#my-exercise-tracker)
I created the backend project ***inside*** the React app (not recommended for real projects).

> One big question arises when you think about making the front-end aware of the back-end URI.
> How are we going to make the back-end URI configurable for the front-end ??? **WIP**

```
mkdir backend
cd backend
npm init -y
npm install express nodemon cors mongoose dotenv
```
or
```
yarn add express nodemon cors mongoose dotenv
```
Ensure that the `.gitignore` file contains `/backend/node_modules` and `.env`.

Setup the backend environment in the `.env` file
```
DB_URI=mongodb://user:password@ds063919.mlab.com:63919/mymongo
PORT=4202
ATLAS_DB_URI=mongodb+srv://scott:tiger@mymongo.mdsyy.mongodb.net/mymongo?retryWrites=true&w=majority
MLAB_DB_URI=mongodb://scott:tiger@ds063919.mlab.com:63919/mymongo
LOCAL_DB_URI=mongodb://localhost:27017/test
```
* [server](#basic-server)
* [database](#database-interface)
* [routing](#routing)
* [putting everything to work](#completion)

### BASIC server[^](#app-backend)
Prepare a BASIC `server.js` file to check that everything works
```
const express = require ('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// older versions of Express required
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

// one method
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log(`MongoDB database connection established successfully`);
})

// another method
// mongoose.connect(uri)
// 	.then(
// 		() => {
// console.log(`MongoDB database connection established successfully`)
// 		},
// 		err => {
// 			console.log(`Can not connect to MongoDB database ` + err)
// 		}
// 	);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```
Run the backend app
```
cd backend
nodemon server.js
```
oppure (in base a dove è registrato il file **.env** contenente la URI) :
```
nodemon backend/server
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
Last line could have been
```
const module.exports = mongoose.model('User', userSchema);
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
oppure
```
yarn add bootstrap react-router-dom react-datepicker axios
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
This is the original version (note how it invokes `src/App.js`) :
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
so for our scope `src/index.js` is trimmed down.
The `render()` function will inject into the **root** div of `index.html` the outputs provided by `App.js`.
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
```
Note that it imports `src/App.js`

### App js[^](#app-frontend)
Now comes `src/App.js` - this was the original **Reactjs** version :
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
In the `src/App.js` file we will break down the entire application into visual components.
In the following code : *Navbar*, *ExercisesList* etc. are all visual components.
Routing consists in matching request addresses with specific components.
The **BrowserRouter** library makes it easy to manage routing (opening and closing specific components based on the requested address).
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
      <Route exact path "/" component={ExercisesList} />
      <Route       path "/edit/:id" component={ExerciseEdit} />
      <Route       path "/create" component={ExerciseCreate} />
      <Route       path "/user" component={UserCreate} />
    </Router>
  );
}

export default App;
```
> Note that `import "bootstrap/dist/css/bootstrap.min.css";` is equivalent to `import '../node_modules/bootstrap/dist/css/bootstrap.min.css';`.
> Note that `import "bootstrap/dist/css/bootstrap.min.css";` in another tutorial is put into `index.js` (importing `App.js`)


#### CSS style sheets[^](#components)
Source file `src/App.css`
```
.App {
  text-align: center;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
  pointer-events: none;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```
Source file `src/index.css`
```
ody {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
```

#### Components[^](#app-frontend)
And now we design the single React components.
* [Navigation Bar](#navbar)
* [Stub components](#stub-components)
* [Create](#create-component)
* [List](#list-component)
* [Edit](#edit-component)

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
      <div style={{marginTop: 50}}>
        <p>This is the ExercisesList component ...</p>
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
[create an user](#create-component)
[list exercises](#list-component)
[edit an exercise](#edit-component)

#### create component[^](#components)
Basic version in `src/components/user-create.component.js` file :
```
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

    // empty the field for further input
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
```
Advanced version in `src/components/exercise-create.component.js` file, with everything but the kitchen sink :
```
import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
// datepicker requires a specific stylesheet ...
import 'react-datepicker/dist/react-datepicker.css';

export default class ExerciseCreate extends Component {
  constructor(props) {
    // super() ... always needed in React
    super(props);

    // this event binding ... always needed in React
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
