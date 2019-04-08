const express = require('express');
const User = require('../models/users.js');
const router = new express.Router();

router.post('/users', async (req, res) => {
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

router.post('/users/login', (req, res) => {
    try {
        const user = User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch(error) {
        res.status(400).send(error);
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'name', 'password', 'email', 'age' ];
    const isValidRequest = updates.every( update => allowedUpdates.includes(update) );

    if( !isValidRequest ) {
        return res.status(404).send({ 'error': 'Invalid update request.' });
    }

    try {
        const user = await User.findById(req.params.id);
        if( !user ) {
            return res.status(404).send(); 
        }
        updates.forEach( update => user['update'] = req.body['update'] );
        await user.save();
        res.send(user);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if( !user ) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;