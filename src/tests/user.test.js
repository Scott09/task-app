const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

const userOne = {
  "name": "Mike",
  "email": "mike@test.com",
  "password": "1234567"
}

beforeEach(async () => {
  await User.deleteMany();
  await userOne.save();
});

afterEach(() => {
  console.log('afterEach');
})

test('Should signup new user', async () => {
  await request(app).post('/users').send({
    "name": "Scott Appleton",
    "email": "scottappleton100000@gmail.com",
    "password": "1234567"
  }).expect(201)
});





