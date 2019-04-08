const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
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
})

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email } );
    if(!user) {
        throw new Error('User doesnot exists');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login. Invalid credentials');
    }
    return user;
}

module.exports = User;