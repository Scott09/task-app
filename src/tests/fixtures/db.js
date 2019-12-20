const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Task = require('../../models/task');

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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  "_id": userTwoId,
  "name": "Andrew",
  "email": "Andrew@test.com",
  "password": "12345",
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, 'thisismysecret')
  }]
}

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
}

module.exports = {
  userOneId,
  userOne,
  UserTwoId,
  UserTwo,
  setupDatabase
}