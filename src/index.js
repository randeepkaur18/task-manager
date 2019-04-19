const app = require('./app');

// Setting the port
const port = process.env.PORT;

app.listen(port, () => {
    console.log('Service is running on port: ', port);
});

