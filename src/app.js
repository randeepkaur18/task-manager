const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');

/* 
 * Instantiating express by executing express() function.
 * Creates the express app.
 */
const app = express();

// It will automatically parse JSON request into Object
app.use(express.json());

// Register user and task endpoints(routes)
app.use(userRouter);
app.use(taskRouter);

module.exports = app;