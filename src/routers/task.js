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
// Query strings accepted  /tasks?completed= (true or false);
//                         /tasks?limit=10 (limit to 10 search results);
//                         /tasks?skip=10 (will skip first 10 search results);
//                        /tasks?sortBy=createdAt_asc   first argument = what you want to sort, second = how
// Can chain these together
router.get('/tasks', auth, async (request, response) => {

  
  const match = {};
  const sort = {};

  if (request.query.completed) {
    match.completed = request.query.completed === 'true';
  }

  if (request.query.sortBy) {
    const parts = request.query.sortBy.split('_');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const user = request.user;
   
      await user.populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(request.query.limit),
          skip: parseInt(request.query.skip),
          sort
        }
      }).execPopulate();
    
    response.status(200).send(user.tasks);
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

router.delete('/tasks/:id', auth, async (request, response) => {
  

  try {
    const user = await Task.findOneAndDelete({
      _id: request.params.id,
      owner: request.user._id
    });

    if (!user) {
      return response.status(404).send('Could not find user');
    }
    response.send(202).send(user);
  } catch (error) {
    response.status(400).send(error);
  }
})


module.exports = router;