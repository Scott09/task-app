const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user')


const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  "_id": userOneId,
  "name": "Mike",
  "email": "mike@test.com",
  "password": "1234567",
  tokens: [{
    token: jwt.sign({ _id: userOneId }, 'thisismysecret')
  }]
}

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}