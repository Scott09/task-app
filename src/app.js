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
app.post('/users', async (request, response) => {

  const user = new User(request.body);
    try {
      await user.save();
      response.status(201).send(user);
    } catch (error) {
      response.status(400).send(error);
    }

});


// Endpoint to get all users
app.get('/users', async (request, response) => {

  try {
    const users = await User.find({})
    response.status(200).send(users);
  } catch (error) {
    response.status(400).send(error);
  }

});

// Endpoint to get a specific user by uid
app.get('/users/:id', async (request, response) => {

  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(400).send('Could not find user');
    }
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send(error);
  }
})

// Endpoint to delete a specific user

app.delete('/users/:id', async (request, response) => {

  try {
    await User.findByIdAndDelete(request.params.id);
    response.status(202).send('User deleted');
  } catch (error) {
    response.status(404).send(error);
  }

})

//Endpoint to update specific user

app.patch('/users/:id', async (request, response) => {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true , runValidators: true });
    
    if (!user) {
      return response.status(404).send('No user found');
    }
    response.status(200).send(user);

  } catch (error) {
    response.status(500).send(error);
  }
})


// Endpoint to create a new task resource
app.post('/tasks', async (request, response) => {

  try {
    const task = new Task(request.body);
    await task.save();
    response.status(201).send(task);
  } catch (error) {
    response.status(400).send(error);
  }

})

// Endpoint to retrieve all tasks
app.get('/tasks', async (request, response) => {

  try {
    const tasks = await Task.find({});
    response.status(200).send(tasks);
  } catch (error) {
    response.status(500).send(error);
  }
})


// Endpoint to retrieve specific task by id
app.get('/tasks/:id', async (request, response) => {


  try {
    const task = await Task.findById(request.params.id);
    if (!task) {
      return response.status(404).send('No task found');
    }
    response.status(200).send(task);
  } catch (error) {
    response.status(500).send(error);
  }
 
})

app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
})