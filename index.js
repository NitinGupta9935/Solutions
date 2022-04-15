const express = require('express');
const app = express();

// for production
require('./startup/prod')(app);


app.set('view engine', 'ejs');
app.set('views', './views');

// login
const logins = require('./routes/login');
app.use('/', logins);

// home page
const home = require('./routes/home');
app.use('/home', home);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});