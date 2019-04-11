const express = require('express');
const User = require('../models/users.js');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
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

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(error) {
        res.status(400).send(error);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( token => req.token !== token );
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
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

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.put('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'name', 'password', 'email', 'age' ];
    const isValidRequest = updates.every( update => allowedUpdates.includes(update) );

    if( !isValidRequest ) {
        return res.status(404).send({ 'error': 'Invalid update request.' });
    }

    try {
        updates.forEach( update => req.user[update] = req.body[update] );  
        await req.user.save();
        res.send(req.user);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        req.user.remove();
        res.send(req.user);
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;