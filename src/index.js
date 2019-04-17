const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');

/* 
 * Instantiating express by executing express() function.
 * Creates the express app.
 */
const app = express();

// Setting the port
const port = process.env.PORT;

// It will automatically parse JSON request into Object
app.use(express.json());

// Register user and task endpoints(routes)
app.use(userRouter);
app.use(taskRouter)

app.listen(port, () => {
    console.log('Service is running on port: ', port);
});

