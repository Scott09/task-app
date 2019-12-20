const request = require('supertest');
const app = require('../app');
const Task = require('../models/task');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
  .post('/tasks')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    description: 'From my test'
  })
  .expect(201);
  const task = await Task.findById(response.body._id);

  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
})


test('Get all tasks from user one', async () => {
  const response = await request(app)
  .get('/tasks')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .expect(200);

  expect(response.body).toHaveLength(2);
})

