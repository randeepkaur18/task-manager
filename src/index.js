const express = require('express');
require('./db/mongoose.js');
const User = require('./models/users.js');
const Task = require('./models/tasks.js');

// Instantiating express by executing express() function.
const app = express();

// Setting the port
const port = process.env.PORT || 3001;

// It will automatically parse JSON request into Object
app.use(express.json());

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }

    /* Below is the request handler with callback  */
    /* user.save().then(() => {
            res.status(201).send(user);
        }).catch(error => {
            res.status(400).send(error);
        });
    */
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'name', 'password', 'email', 'age' ];
    const isValidRequest = updates.every( update => allowedUpdates.includes(update) );

    if( !isValidRequest ) {
        return res.status(404).send({ 'error': 'Invalid update request.' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        if( !user ) {
            return res.status(404).send(); 
        }
        res.send(user);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = User.findByIdAndDelete(req.params.id);
        if( !user ) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(error) {
        res.status(500).send(error);
    }
})



// ==================== End points to manage tasks =====================
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'description' ];
    const isValidRequest = updates.every( update => allowedUpdates.includes(update));

    if( !isValidRequest ) {
        return res.status(404).send({ 'error': 'Invalid update request.' });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        if( !task ) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(error) {
        res.status(400).send(error);
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = Task.findByIdAndDelete(req.params.id);
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(error) {
        res.status(500).send(error);
    }
})

app.listen(port, () => {
    console.log('Service is running on port: ', port);
});