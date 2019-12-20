const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);


test('Should signup new user', async () => {
  const response = await request(app).post('/users').send({
    "name": "Scott Appleton",
    "email": "scottappleton1@gmail.com",
    "password": "1234567"
  }).expect(201)

  // Make sure the database now has that user
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Scott Appleton',
      email: 'scottappleton1@gmail.com'
    },
    token: user.tokens[0].token
  })

  // Make sure the database is not storing a plaintext password
  expect(user.password).not.toBe('1234567')
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId);
  
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Testing if user login information is incorrect', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: "thisisnotthepassword"
  }).expect(400)
});

test('Should get user profile', async () => {
  await request(app)
  .get('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
});

test('Should fail to get user profile for unauthenticated user', async() => {
  await request(app)
  .get('/users/me')
  .send()
  .expect(401)
})

test('Should successfully delete user', async () => {
  await request(app).delete('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(202)

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete user with no Authorization', async () => {
  await request(app).delete('/users/me')
  .send()
  .expect(401)
});

// Make sure we can upload an image and get a 200 HTTP response when authenticated
test('Should upload avatar image', async() => {
  await request(app).post('/users/me/avatar')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .attach('avatar', 'src/tests/fixtures/profile-pic.jpg')
  .expect(200)
});

// Make sure we are not able to upload an image if we are not authenticated

test('Should not be able to upload image due to no Authentication provided', async () => {
  await request(app).post('/users/me/avatar')
  .attach('avatar', 'src/tests/fixtures/profile-pic.jpg')
  .expect(401)
});

// Test case updating valid user field
test('Should update users name', async () => {
  await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    name: 'Scott'
  })
  .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual('Scott');
})

test('Should not allow us to update an invalid user field', async () => {
  await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    location: 'Vancouver'
  })
  .expect(400)
})


