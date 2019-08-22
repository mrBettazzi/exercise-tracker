# my-exercise-tracker
This projects gathers all the info I learned following
[this online tutorial](https://www.youtube.com/watch?v=7CqJlxBYj-M) about the MERN stack.

## Prerequisites
* [mlab](https://mlab.com) account
* [Github](https://github.com/github) account
* database initialized [here](https://mlab.com/databases/mymongo/collections) 
* Git project initialized [here](https://github.com/mrBettazzi/exercise-tracker)
* node installed (run `node -v`to check version)
* nodemon installed (`npm install -g nodemon`)
* yarn installed
* Postman app installed (no `npm`, no `brew`, occorre fare download dal loro sito)

## Kick off
bootstrap the React project with [Create React App](https://github.com/facebook/create-react-app)
```
create-react-app my-exercise-tracker
cd my-exercise-tracker
git init
```
Ensure that the `.gitignore` file contains `/node_modules`.
Check that everything works using `yarn start`

```
git add .
git remote add otigin https://github.com/mrBettazzi/exercise-tracker
git commit -m "plain starr"
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
