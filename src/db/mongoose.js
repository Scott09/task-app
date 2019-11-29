const mongoose = require('mongoose');
const validator = require('validator');

require('dotenv').config();

mongoose.connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useCreateIndex: true
}, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connected to Mongo');
  }
})

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Must provide a valid email');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain the word password')
      }
    }
  }
})

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    boolean: Boolean,
    default: false
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

// const me = new User({
//   name: 'Scott',
//   email: 'Scott@gmail.com',
//   password: "passvalid"
// })


// me.save().then(() => {
//   console.log(me);
// }).catch((error) => {
//   console.log('Error', error);
// })