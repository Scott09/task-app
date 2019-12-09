const express = require('express');
const auth = require('../middleware/auth');

const router = new express.Router();
const Task = require('../models/task');

// Endpoint to create a new task resource
router.post('/tasks', auth,  async (request, response) => {

  try {
    // const task = new Task(request.body);

    const task = new Task({
      ...request.body,
      "owner": request.user._id
    })
    await task.save();
    response.status(201).send(task);
  } catch (error) {
    response.status(400).send(error);
  }
})

// Endpoint to retrieve all tasks
router.get('/tasks', async (request, response) => {

  try {
    const tasks = await Task.find({});
    response.status(200).send(tasks);
  } catch (error) {
    response.status(500).send(error);
  }
})


// Endpoint to retrieve specific task by id
router.get('/tasks/:id', auth, async (request, response) => {

  try {

    const task = await Task.findOne({
      _id: request.params.id,
      owner: request.user._id
    });

    if (!task) {
      return response.status(404).send('No task found');
    }
    response.status(200).send(task);
  } catch (error) {
    response.status(500).send(error);
  }
 
})


// Endpoint to retrieve and update a specific task

router.patch('/tasks/:id', async (request, response) => {
  const updates = Object.keys(request.body);
  const allowedUpdates = ["description", "completed"];

  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValid) {
    return response.status(400).send('Invalid updates');
  }

  try {

    const task = await Task.findById(request.params.id);

    updates.forEach((update) => {
      task[update] = request.body[update];
    })

    await task.save()

    // const task = await Task.findByIdAndUpdate(request.params.id, request.body, {new: true, runValidators: true});
    if (!task) {
      return response.status(404).send('No task found');
    }
    response.status(200).send(task);
  } catch (error) {
    response.status(400 ).send(error);
  }
})


// Endpoint to delete specific task

router.delete('/tasks/:id', async (request, response) => {
  try {
    const user = await Task.findByIdAndDelete(request.params.id);

    if (!user) {
      return response.status(404).send('Could not find user');
    }
    response.send(202).send(user);
  } catch (error) {
    response.status(400).send(error);
  }
})


module.exports = router;