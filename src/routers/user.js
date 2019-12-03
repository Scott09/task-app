const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// Endpoint to create a new user
router.post('/users', async (request, response) => {
    try {
      const user = new User(request.body);
      const token = await user.generateAuthToken();
      response.status(201).send({user, token});
    } catch (error) {
      response.status(400).send(error);
    }
});
 
router.post('/users/login', async (request, response) => {
  try {
    const user = await User.findByCredentials(request.body.email, request.body.password);
    const token = await user.generateAuthToken();
    response.send({user, token});
  } catch (error) {
    response.status(400).send()
  }
})

router.get('/users/me', auth, async (request, response) => {
  response.send(request.user);
})


// Endpoint to get all users
router.get('/users', auth ,async (request, response) => {

  try {
    const users = await User.find({})
    response.status(200).send(users);
  } catch (error) {
    response.status(400).send(error);
  }

});

// Endpoint to get a specific user by uid
router.get('/users/:id', async (request, response) => {

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

router.delete('/users/:id', async (request, response) => {

  try {
    await User.findByIdAndDelete(request.params.id);
    response.status(202).send('User deleted');
  } catch (error) {
    response.status(404).send(error);
  }
})

//Endpoint to update specific user

router.patch('/users/:id', async (request, response) => {

  const updates = Object.keys(request.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return response.status(400).send('Invalid updates');
  }


  try {

    const user = await User.findById(request.params.id);

    updates.forEach((update) => user[update] = request.body[update])

    await user.save()


    // const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true , runValidators: true });

    if (!user) {
      return response.status(404).send('No user found');
    }
    response.status(200).send(user);

  } catch (error) {
    response.status(500).send(error);
  }
})


module.exports = router;