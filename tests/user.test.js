const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/users');

const userId = new mongoose.Types.ObjectId;
const user = {
    _id: userId,
    name: 'Max',
    email: 'max@test.com',
    password: 'max@12345',
    tokens: [{
        token: jwt.sign({ _id: userId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(user).save();
});

test('Should save a new user', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Jane',
            email: 'jane@test.com',
            password: 'jane@12345'
        })
        .expect(201);
});

test('Should not signup a user with existing email', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Max',
            email: 'max@test.com',
            password: 'max@12345'
        })
        .expect(400);
});

test('Should login existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200);
});

test('Should not login non-existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'jane@test.com',
            password: 'jane@12345'
        })
        .expect(400);
});

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({})
        .expect(200);
});

test('Should not get user profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send({})
        .expect(401);
});

test('Should update user details', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            name: 'Max S.',
            age: 26
        })
        .expect(200);
});

test('Should not update if invalid user details', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            location: 'Bangalore',
            age: 26
        })
        .expect(400);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({})
        .expect(200);
});

test('Should not delete unauthorized user', async () => {
    await request(app)
        .get('/users/me')
        .send({})
        .expect(401);
});

test('Should upload profile image', async () => {
    await request(app)
        .post('/users/me/profileImage')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .attach('file', 'tests/fixtures/default_profile_pic.jpg')
        .expect(200);
});

test('Should not upload profile image for unauthorized user', async () => {
    await request(app)
        .post('/users/me/profileImage')
        .attach('file', 'tests/fixtures/default_profile_pic.jpg')
        .expect(401);
});

test('Should logout the current session for logged in user', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .expect(200);
});

test('Should not logout the current session for unauthorized user', async () => {
    await request(app)
        .post('/users/logout')
        .expect(401);
});

test('Should logout all the sessions for logged in user', async () => {
    await request(app)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .expect(200);
});

test('Should not logout all the sessions for unauthorized user', async () => {
    await request(app)
        .post('/users/logoutAll')
        .expect(401);
});
