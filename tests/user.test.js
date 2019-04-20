const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/users');

const userOneId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userOneId,
    name: 'Max',
    email: 'max@test.com',
    password: 'max@12345',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should save a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Jane',
            email: 'jane@test.com',
            password: 'jane@12345'
        })
        .expect(201);

    // Assert if user got saved in the database successfully
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Jane',
            email: 'jane@test.com'
        },
        token: user.tokens[0].token
    });

    // Assert the password is encrypted
    expect(user.password).not.toBe('jane@12345');
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
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);

    // Assert the new token generated and stored into the database
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
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
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(200);
});

test('Should not get user profile for unauthenticated user', async () => {
    const response = await request(app)
        .get('/users/me')
        .send({})
        .expect(401);

    expect(response.body).toMatchObject({ 'error': 'Please authenticate' });
});

test('Should update user details', async () => {
    const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Max S.',
            age: 26
        })
        .expect(200);
    
    const user = await User.findById(userOneId);
    expect(response.body).toMatchObject({
        name: 'Max S.',
        age: 26
    })
});

test('Should not update if invalid user details', async () => {
    const response = await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Bangalore',
            age: 26
        })
        .expect(400);

    expect(response.body).toMatchObject({ 'error': 'Invalid update request.' });
});

test('Should not update for unauthenticated user', async () => {
    const response = await request(app)
        .put('/users/me')
        .send({
            name: 'Max S.',
            age: 26
        })
        .expect(401);
    
    expect(response.body).toMatchObject({ error: 'Please authenticate' });
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    // expect(user).toBeNull();
});

test('Should not delete unauthorized user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .send({})
        .expect(401);

    expect(response.body).toMatchObject({ 'error': 'Please authenticate' });
});

test('Should upload profile image', async () => {
    await request(app)
        .post('/users/me/profileImage')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('file', 'tests/fixtures/default_profile_pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.profileImage).toEqual(expect.any(Buffer));
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
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
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
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
});

test('Should not logout all the sessions for unauthorized user', async () => {
    await request(app)
        .post('/users/logoutAll')
        .expect(401);
});
