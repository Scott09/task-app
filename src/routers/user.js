const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');


// Endpoint to create a new user
router.post('/users', async (request, response) => {
    try {
      const user = new User(request.body);
      sendWelcomeEmail(user.email, user.name);
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


const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(request, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a jpg, jpeg or png'))
    }
    cb(undefined, true);
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (request, response) => {

  // request.user.avatar = request.file.buffer;
  const buffer = await sharp(request.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  request.user.avatar = buffer;
  await request.user.save();

  response.status(200).send();
}, (error, request, response, next) => {
  response.status(400).send({ error: error.message })
});


router.delete('/users/me/avatar', auth, async (request, response) => {
  try {
    request.user.avatar = undefined;
    await request.user.save();
    response.status(200).send();
  } catch (error) {
    response.status(400).send(error);
  }
})


// Endpoint to get all users
router.get('/users', auth , async (request, response) => {

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
    sendCancellationEmail(request.user.email, request.user.name)

    response.status(202).send('User deleted');
  } catch (error) {
    response.status(404).send(error);
  }
})

// Get a users avatar so it can be fetched to the front end

router.get('/users/:id/avatar', async (request, response) => {
  try {

    const user = await User.findById(request.params.id);

    if (!user && !user.avatar) {
      throw new Error()
    }

    response.set('Content-Type', 'image/png')
    response.status(200).send(user.avatar);
  } catch (error) {
    response.status(404).send()
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