'use strict';

const express = require('express');
const middlewares = require('../modules/middlewares');

function create(taskHandlers) {

    const router = express.Router();

    router.get('/tasks', taskHandlers.createGetTasks());
    router.post('/tasks', middlewares.jsonContentMiddleware, taskHandlers.createPostTask());
    
    router.get('/tasks/:id', taskHandlers.createGetSingle("id"));
    router.delete('/tasks/:id', taskHandlers.createDeleteSingle("id"));
    router.put('/tasks/:id', middlewares.jsonContentMiddleware, taskHandlers.createPutSingle("id"));

    return router;
}


module.exports.create = create;