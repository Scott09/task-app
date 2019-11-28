const mongoose = require('mongoose');

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
    type: String
  },
  age: {
    type: Number
  }
})


const me = new User({
  name: 'Scott',
  age: 27
})


me.save().then(() => {
  console.log(me);
}).catch((error) => {
  console.log('Error', error);
})