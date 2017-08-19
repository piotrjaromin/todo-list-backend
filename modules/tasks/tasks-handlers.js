'use strict';

const model = require('./tasks-model');
const errors = require('../errors');

function create(taskService, taskValidator) {

    function createGetTasks() { 
        return (req, res, next) =>{
        
            taskService
                .getTasks()
                .then( tasks => res.status(200).send(tasks))
                .catch(next);
        }
    } 

    function createPostTask() { 
        return (req, res, next) =>{
            
            const validationErrors = taskValidator.validate(req.body);
            if (validationErrors ) {
                return next(new errors.BadRequest("Invalid payload sent", validationErrors));
            }

            const newTask = new model.CreateTask(req.body);
            taskService
                .createTask(newTask)
                .then( id => res.status(201).json(newTask))
                .catch(next);
        }
    } 

    function createGetSingle(idParam) { 
        return (req, res, next) =>{
            const taskId = req.params[idParam];

            taskService
                .getById(taskId)
                .then( task => res.status(200).json(task))
                .catch(next);
        }
    } 

    function createDeleteSingle(idParam) { 
        return (req, res, next) =>{
            const taskId = req.params[idParam];
            taskService
                .deleteById(taskId)
                .then( task => res.status(204).end())
                .catch(next);
        }
    } 

    function createPutSingle(idParam) { 
        return (req, res, next) =>{

            const validationErrors = taskValidator.validate(req.body);
            if  (validationErrors ) {
                return next(new errors.BadRequest("Invalid payload sent", validationErrors));
            }

            const updatedTask = new model.CreateTask(req.body);
            const taskId = req.params[idParam];

            taskService
                .updateTask(taskId, updatedTask)
                .then( task => res.status(204).end())
                .catch(next);
        }
    } 

    return {
        createGetTasks,
        createPostTask,
        createGetSingle,
        createDeleteSingle,
        createPutSingle
    }
}

module.exports.create = create;