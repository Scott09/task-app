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


// const Book = mongoose.model('Book', {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   length: {
//     type: Number,
//     required: true,
//     trim: true
//   }
// })


// const newbook = new Book({
//   name: 'Harry Potter',
//   length: 400
// })

// newbook.save().then(() => {
//   console.log(newbook);
// }).catch((error) => {
//   console.log(error);
// })