const express = require('express');
require('./db/mongoose.js');
const User = require('./models/users.js');
const Task = require('./models/tasks.js');

const app = express();
const port = process.env.PORT || 4000;

// It will automatically parse JSON request into Object
app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.send(user);
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
    }).catch(error => {
        res.status(400).send(error);
    })
})



app.listen(port, () => {
    console.log('Service is running on port: ', port);
});