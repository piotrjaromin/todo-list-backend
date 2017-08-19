'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const config = require('config');
const errors = require('../modules/errors');

//First connect to database, then start application
require('../modules/mongo-con')
  .init(config.get("mongodb"))
  .then(initApp)
  .catch( err => {
    console.log("Error while starting app. Details: ", err);
  });

function initApp(collection) {

  const app = express();
  
  //enable basic authorization
  app.use(basicAuth({ 
    users: config.get("basicAuth"),
    challenge: true
  }));

  app.use(bodyParser.json());

  //init business endpoints
  require('../modules/tasks/tasks-init')(app, collection);

  //error handler
  app.use(require('../modules/middlewares').errorMiddleware);


  const port = config.get("port");
  app.listen(port, () => console.log("listening on port ", port));

}