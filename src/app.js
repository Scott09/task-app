const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

require('./db/mongoose');


const User = require('./models/user');



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
  User.find({}, (error, users) => {
    if (error) {
      return response.status(400).send(error);
    }
    response.status(200).send(users);
  })
});






app.get('/', (request, response) => {
  response.send('Hey im the response')
})

app.post('/tasks', (request, response) => {

})


app.listen(PORT, () => {
  console.log('App is listening on port ' + PORT);
})