var express = require('express'),
    bodyParser = require('body-parser'),
    appConfig = require('./appConfig.js'),
    app = require('express')(),
    tools = require('./tools.js');

tools.pripremiFoldere();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  if (appConfig.appVerzija === req.query.appVersion) {
    next();
  } else {
    // res.status(505).send({ error: 'Pogrešna verzija!' })
    next();
  }
});

app.use(function (req, res, next) {
  var userExists = false;
  if (req.method != 'OPTIONS') {
    if (req.originalUrl.substring(5, 14) !== 'userLogin') {
      if (appConfig.checkAuthHeader === true) {
        if (req.headers['authorization']) {
          let korisnikToken = req.headers['authorization'];
          if (login.checkIfLoggedIn(korisnikToken)) {
            next();
          } else {
            res.status(401).send({
              error: 'Neautorizirani pristup!'
            });
          }
        } else if (req.originalUrl.substring(req.originalUrl.length - 3, req.originalUrl.length) === 'rpt' || req.originalUrl.substring(5, 16) === 'LaTosConfig') {
          next();
        } else {
          res.status(401).send({
            error: 'Neautorizirani pristup!'
          });
        }
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

app.use('/api', require('./api'));
var port = appConfig.applicationPort;

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log('ERROR: ', err.message, err.status);
  res.status(err.status || 500).end();
});

module.exports = app;
app.listen(port);
console.log('Server started ' + port);
