// const mongoose = require('../db/mongoose.js');
// const validator = require('validator');

// const User = mongoose.model('User', {
//     name : {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true,
//         lowercase: true,
//         validate(value) {
//             if(value.toLowercase().includes('password')) {
//                 console.log('Password should not contain password.');
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0) {
//                 console.log('Age should be positive.')
//             }
//         }
//     }
// })