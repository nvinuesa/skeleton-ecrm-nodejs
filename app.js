const fs = require('fs');

const async = require('async');
const express = require('express');

const env = module.exports.env = process.env.NODE_ENV || 'dev';
const name = require('./package.json').name;
const version = require('./package.json').version;

const logger = require('morgan');
var bodyParser = require('body-parser');

// MongoDB datasource
const mongo = require('./config/' + env + '.js').mongo;
const mongoose = require('mongoose');
mongoose.connect(mongo.url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Main Express app
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Routes
const routes = [
        './profile/profile'
    ].forEach((module) => app.use(require(module + '-routes')));

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('Server error!');
});

module.exports = app;

