const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/users');
const Task = require('../../src/models/tasks');

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

const userTwoId = new mongoose.Types.ObjectId;
const userTwo = {
    _id: userTwoId,
    name: 'John',
    email: 'john@test.com',
    password: 'john@12!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: 'Task One',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: 'Task Two',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: 'Task Three',
    completed: false,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}