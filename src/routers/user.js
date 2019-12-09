const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();


const multer = require('multer');

const upload = multer({
  dest: 'avatars'
});
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




// Logout from session endpoint
router.post('/users/logout', auth, async (request, response) => {
  try {
    request.user.tokens = request.user.tokens.filter((token) => {
      return token.token !== request.token;
    })
    await request.user.save();
    response.send();
  } catch (error) {
    response.status(500).send();
  }
})

// Logout user from all sessions
router.post('/users/logout/all', auth, async (request, response) => {
  try {
    request.user.tokens = [];
    await request.user.save();
    response.send();
  } catch (error) {
    response.status(500).send();
  }
})

router.get('/users/me', auth, async (request, response) => {
  response.send(request.user);
})

router.post('/users/me/avatar', upload.single('avatar'), async (request, response) => {
  response.status(200).send();
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

// Endpoint to delete a specific user

router.delete('/users/me', auth, async (request, response) => {

  try {
    
    await request.user.remove();
    response.status(202).send('User deleted');
  } catch (error) {
    response.status(404).send(error);
  }
})



//Endpoint to update specific user

router.patch('/users/me', auth, async (request, response) => {

  const updates = Object.keys(request.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  })

  if (!isValidOperation) {
    return response.status(400).send('Invalid updates');
  }


  try {

    updates.forEach((update) => request.user[update] = request.body[update])

    await request.user.save()

    response.status(200).send(request.user);

  } catch (error) {
    response.status(500).send(error);
  }
})


module.exports = router;