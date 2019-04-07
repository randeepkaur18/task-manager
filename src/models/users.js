const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name : {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if( !validator.isEmail(value) ) {
                throw new Error('Password is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain password.');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new error('Age must be positive.');
            }
        }
    }
});

module.exports = User;