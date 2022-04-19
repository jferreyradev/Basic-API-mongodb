const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const apiRouter = require('./routes/api');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'asdfñlkj_poiwmnv123',
    resave: true,
    saveUninitialized: true
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

module.exports = app;