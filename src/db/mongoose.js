const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connected to Mongo');
  }
})
