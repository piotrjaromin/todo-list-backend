'use strict';

require('should');

const model = require('../../modules/tasks/tasks-model');

describe("Tasks model should", () => {

    it("correctly create object with only root task", () => { 

        const text = "random txt";

        const task = new model.CreateTask({
            text
        });

        task.text.should.equal(text);
        task.subTasks.should.have.length(0);
        task.done.should.be.false();
    })

    it("correctly create object with nested tasks", () => { 

        const text1 = "random txt 123";
        const text2 = "random txt 345";
        const text3 = "random txt 567";

        const task = new model.CreateTask({
            text : text1,
            subTasks: [
            {
                text : text2,
                subTasks : [{
                    text : text3
                }]
            },
            {
                text : text3
            }]
        });

        task.text.should.equal(text1);
        task.subTasks.should.have.length(2);
        task.subTasks[0].text.should.equal(text2);
        task.subTasks[1].text.should.equal(text3);

        task.subTasks[0].subTasks.should.have.length(1);
        task.subTasks[1].subTasks.should.have.length(0);

        task.subTasks[0].subTasks[0].text.should.equal(text3);

    })

})