const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

require('./db/mongoose');


const User = require('./models/user');
const Task = require('./models/task');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


// Endpoint to create a new user
app.post('/users', (request, response) => {

  const user = new User(request.body);

  user.save().then(() => {
    console.log('New user saved');
    response.status(201).send('New user resource created');
  }).catch((error) => {
    response.status(400).send(error);
  })
});


// Endpoint to get all users
app.get('/users', (request, response) => {
  User.find({}).then((users) => {
    response.status(200).send(users);
  }).catch((error) => {
    response.status(400).send(error);
  })
});

// Endpoint to get a specific user by uid
app.get('/users/:id', (request, response) => {
  User.findById(request.params.id).then((user) => {
    response.status(200).send(user);
  }).catch((error) => {
    response.status(400).send(error);
  })
})

// Endpoint to delete a specific user

app.delete('/users/:id', (request, response) => {
  User.findByIdAndDelete(request.params.id, (error) => {
    if (error) {
      return response.status(400).send(error);
    }

    response.status(202).send('User deleted');
  })
})


// Endpoint to create a new task resource
app.post('/tasks', (request, response) => {
  const task = new Task(request.body);

  task.save().then(() => {
    response.status(201).send(task);
  }).catch((error) => {
    response.status(400).send(error);
  })
})











app.get('/', (request, response) => {
  response.send('Hey im the response')
})

app.post('/tasks', (request, response) => {

})


app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
})