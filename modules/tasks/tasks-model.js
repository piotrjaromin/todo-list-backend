'use strict';

class CreateTask {

    constructor(params) {
        this.text = params.text;
        this.done = params.done || false;
        this.subTasks = params.subTasks || [];
    }

}

module.exports.CreateTask = CreateTask;