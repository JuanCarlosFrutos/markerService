var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var marker = require('./routes/marker');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/marker', marker);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status);
    res.json({ error: err.message })
});

module.exports = app;
