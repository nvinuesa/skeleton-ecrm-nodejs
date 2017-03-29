const fs = require('fs');

const async = require('async');
const express = require('express');

const env = module.exports.env = process.env.NODE_ENV || 'dev';
const name = require('./package.json').name;
const version = require('./package.json').version;

const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// MongoDB datasource
const mongo = require('./config/' + env + '.js').mongo;
const mongoose = require('mongoose');
mongoose.connect(mongo.url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Main Express app
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
// Routes
const routes = [
    './profile/profile'
].forEach((module) => app.use(require(module + '-routes')));

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500);
        res.json({
            code: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        code: err.message,
        error: {}
    });
});

module.exports = app;