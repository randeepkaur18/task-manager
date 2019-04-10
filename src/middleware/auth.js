const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try {
        const token = req.headers('Authorization').replace('Bearer', '');
        const decodedToken = jwt.verify(token, 'taskmanagersecretkey');
        const user = await User.findOne({ _id: decodedToken._id, 'token.token': token });
        if(!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(401).send({ 'error': 'Please authenticate' });
    }

}