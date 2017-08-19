'use strict';

class CreateTask {

    constructor(params) {
        this.text = params.text;
        this.done = params.done || false;

        const subs = params.subTasks || [];
        this.subTasks = subs.map( task => new CreateTask(task));
    }

}


module.exports.CreateTask = CreateTask;