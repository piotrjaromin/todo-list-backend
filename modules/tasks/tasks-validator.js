'use strict';

const _ = require('underscore');

function create() {

    function validate(task) {

        const errors = [];

        if ( _.isEmpty(task.text) ) {
            addError(errors, "Field cannot be empty", "text"); 
        }

        if ( task.subTasks) {

            if ( ! _.isArray(task.subTasks) ) {
                addError(errors, "if subTasks are provided then it must be array", "subTasks");  
            } else {
                const nestedTaskErrors = task.subTasks
                    .map( sub => validate(sub))
                    .reduce( (prevVal, currVal) => {
                        return prevVal.concat(currVal);                    
                    }, []);
                
                errors.push(...nestedTaskErrors);
            }
        }

        if ( task.done !== null && task.done !== undefined && ! _.isBoolean(task.done) ) {
            addError(errors, "Field must be booleans value", "done"); 
        } 

        return errors.length > 0 ? errors : false;
    }

    function addError(errors, msg, field) {
        errors.push({message: "Field cannot be empty", field: "text" });
    }

    return {
        validate
    }
}

module.exports.create = create;