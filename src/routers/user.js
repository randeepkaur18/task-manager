const express = require('express');
const multer = require('multer');
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

//  Login router - authenticate the user and generates the token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(error) {
        res.status(400).send(error);
    }
})

//  Logout router - deletes the current token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token );
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
})

// LogoutAll request handler - logout the user from all sessions
// Deletes all tokens for a user
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch(error) {
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
        return res.status(400).send({ 'error': 'Invalid update request.' });
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

const upload = multer({
    limits: {
        fileSize: 1000000,  // 1000000 = 1MB(size in bytes)
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg, jpeg or png files.'));
        }
        cb(undefined, true);
    }
})

router.post('/users/me/profileImage',auth, upload.single('file'), async (req, res) => {
    try {
        req.user.profileImage = req.file.buffer;
        await req.user.save();
        res.send();        
    } catch(error) {
        res.status(500).send(error);
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/profileImage', auth, async (req, res) => {
    try {
        req.user.profileImage = undefined;
        await req.user.save();
        res.status(200).send();
    } catch(error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id/profileImage', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.profileImage) {
            throw new Error('Not Found')
        }
        res.set('Content-Type', 'img/jpg');
        res.status(200).send(user.profileImage);
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;