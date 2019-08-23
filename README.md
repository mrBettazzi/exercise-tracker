# my-exercise-tracker
This projects gathers all the info I learned following
[this online tutorial](https://www.youtube.com/watch?v=7CqJlxBYj-M) about the MERN stack.

## Prerequisites
* [mlab](https://mlab.com) account
* [Github](https://github.com/github) account
* database initialized [here](https://mlab.com/databases/mymongo/collections) 
* Git project initialized [here](https://github.com/mrBettazzi/exercise-tracker)
* **node** and **npm** installed (`$ node -v`to check version)
* nodemon installed (`$ npm install -g nodemon`)
* yarn installed
* Postman app installed (no `npm`, no `brew`, occorre fare download dal loro sito)
* **create-react-app** installed

## Kick off
bootstrap the React project with [Create React App](https://github.com/facebook/create-react-app)
```
npm -g uninstall create-react-app
npx create-react-app my-exercise-tracker
cd my-exercise-tracker
```
Check that everything works using `yarn start` or `npm start`.
## Git enablement
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

## backend
Create the backend project ***inside*** the React app (not recommended)
```
mkdir backend
cd backend
npm init -y
npm install express cors mongoose dotenv
```
ensure that the `.gitignore` file contains `/backend/node_modules`

Setup the backend environment in the `.env` file
```
DB_URI=mongodb://user:password@ds063919.mlab.com:63919/mymongo
PORT=4202
```

### BASIC `server.js`
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

### Database interface
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
### Routing
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
  const date = Date.parse(req.body.mydate);

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
      exercise.date = Date.parse(req.body.mydate);

      exercise.save()
        .then(() => res.json('Exercise updated'))
        .catch(err => res.status(400).json('Error: ' + err));
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

```
Complete the `server.js` file
```
...

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
Now run again the backend app
```
cd backend
nodemon server.js
```
Then you can use Postman to test the API endpoints :
```
localhost:4202/users/add 
{ "username": "John" }

localhost:4202/exercises/add
{ "username": "John", "description":"stay at home", "duration":"28", "mydate":"2019-05-23T15:14:59.000Z" }

localhost:4202/exercises

localhost:4202/exercises/update/5d5d63e48695740ad00a74f2
{ "username": "John", "description":"back on vacation", "duration":"10", "mydate":"2019-09-01" }

```



## frontend
Make sure you have installed required components
```
npm install bootstrap react-router-dom
```
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
Next important file is `src/index.js` *CALLED IN SOME WAY THAT I DON'T YET UNDERSTAND BY Node.js*.
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
Note that it invokes `src/App.js`. 
We don't need neither specific `.css` files here, nor *serviceWorker*, 
so for our scope `src/index.js`can be trimmed down this way :
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
In the `src/App.js` file we will break down the entire application into visual components.
In the following sample, *Navbar*, *ExercisesList* etc. are all visual components.
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
And now we design the single React components.
### Navbar
Source file is `src/components/navbar.component.js`
```
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Exercise Tracker</Link>
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
```
### stub components
To be able to test the application we need to put in place fake components like this `src/components/exercises-list.component.js`:
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
So that we can now
```
```



# React concepts
## a basic Component (what I want to see on the screen)
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
// usage example in an HTML page : <ShoppingList name="Paolo" />
```

# previous text from create-react-app
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
