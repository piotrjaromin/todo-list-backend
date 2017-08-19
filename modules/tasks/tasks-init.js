'use strict';

function initTasks(app, collection) {

  const taskService = require('../../modules/tasks/tasks-service').create(collection);
  const taskValidator = require('../../modules/tasks/tasks-validator').create();
  const taskHandlers = require('../../modules/tasks/tasks-handlers').create(taskService, taskValidator);

  app.use("/", require('../../routes/tasks-endpoint').create(taskHandlers));

}


module.exports = initTasks;