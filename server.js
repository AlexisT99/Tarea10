const bodyParser = require('body-parser');
const express = require('express');
const studentroute = require('./router/student.router')();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/v1/student',studentroute);
module.exports = app;