const mongoose = require('mongoose');
const validator = require('validator');

require('dotenv').config();

mongoose.connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useCreateIndex: true
}, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connected to Mongo');
  }
})

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Must provide a valid email');
      }
    }
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  }
})

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true
  },
  completed: {
    boolean: Boolean
  }
})


const newtask = new Task({
  description: 'go to mall',
  completed: false
})

newtask.save().then(() => {
  console.log('new task saved');
}).catch((error) => {
  console.log(error)
})

const me = new User({
  name: 'Scott',
  email: 'Scott@gmail.com',
  age: 28
})


me.save().then(() => {
  console.log(me);
}).catch((error) => {
  console.log('Error', error);
})