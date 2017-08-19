'use strict';

const mongo = require('mongodb');
const Promise = require('bluebird');
const errors = require('../errors');

//TODO better handling of result.ok, n etc.

function create(collection) {

    function getTasks() {
        log("getting tasks")
        return collection.find({}).toArray();
    }

    function createTask(newTask) {
        log("creating new task");

        return collection
            .insert(newTask)
            .then( () => {
                log("created new task");
                return newTask;
            });
    }

    function getById(id) {
        log("getting task by id");

        return toMongoId(id)
            .then( oId => collection.findOne({ _id : oId}))
            .then( res => {
                if ( res == null) {
                    return Promise.reject(new errors.NotFoundError(`Task with id ${id} does not exist`));
                }

                return res;
            })
    }

    function deleteById(id) {
        log("deleting task by id");

        return toMongoId(id)
            .then( oId => collection.remove({ _id : oId}))
            .then( res => {
                if ( res.result.n == 0 ) {
                    return Promise.reject(new errors.NotFoundError(`Task with id ${id} does not exists and cannot be deleted`));
                }
                return;
            })
    }
    
    function updateTask(id, updateTask) {
        log("updating task");

        return toMongoId(id)
            .then( oId =>  collection.update( { _id : oId}, updateTask))
            .then( res => {
                if ( res.result.nModified == 0 &&  res.result.n == 0 ) {
                    return Promise.reject(new errors.NotFoundError(`Task with id ${id} does not exists and cannot be updated`));
                }
                log("updated task");
                return updateTask;
            });
    }

    function log(msg) {
        console.log("[service] ", msg)
    }

    function toMongoId(id) {
        
        return new Promise( (resolve, reject) => {
            try {
                return resolve(new mongo.ObjectID(id));
            } catch (err ) {
                return reject(new errors.BadRequest("Invalid task id format. " + err.message));
            }
        });
    }

    return {
        getTasks,
        createTask,
        getById,
        deleteById,
        updateTask
    }
}

module.exports.create = create;