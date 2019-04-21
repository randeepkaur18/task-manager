const request = require('supertest');
const app = require('../src/app');
const { userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db');
const Task = require('../src/models/tasks');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Learn Node JS'
        })
        .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
});

test('Should not create task for non authenticated user', async () => {
    await request(app)
        .post('/tasks')
        .send({
            description: 'Learn Node JS'
        })
        .expect(401)
});

test('Should fetch tasks for user', async () => {
    await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should fetch tasks for non authenticated user', async () => {
    await request(app)
        .get('/tasks')
        .send()
        .expect(401)
});

test('Should delete tasks for user', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not delete tasks for non authenticated user', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
});

test('Should not delete other user tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
        
});