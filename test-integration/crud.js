'use strict';

const express = require('express');
const initTasks = require('../modules/tasks/tasks-init');
const request = require("supertest");
const config = require('config');
const middlewares = require('../modules/middlewares');
const bodyParser = require('body-parser');
const should = require('should');

describe("For crud on tasks should return", () => {

    let collection;
    const app = express();

    let createdId;
    const postTask = {
        text : "created text"
    }
    
    before("init test empty collection", done => {

        require('../modules/mongo-con')
            .init(config.get("mongodb"))
            .then( col => {
                collection = col;
                app.use(bodyParser.json());
                initTasks(app, collection);
                app.use(middlewares.errorMiddleware)
                done();
            });
    })

    it("bad request for empty text field", done => {

        request(app)
            .post("/tasks")
            .send({text : ""})
            .expect(400)
            .end(done);
    })

    it("bad request for subTasks field being other than array", done => {

        request(app)
            .post("/tasks")
            .send({subTasks : 12321})
            .expect(400)
            .end(done);
    })

    it("bad request for done field being other than boolean", done => {

        request(app)
            .post("/tasks")
            .send({done : "random value"})
            .expect(400)
            .end(done);
    })

    it("created new task id", done => {

        request(app)
            .post("/tasks")
            .send(postTask)
            .expect(201)
            .end( (err, resp) => {

                if(err) {
                    done(err);
                }

                resp.body.text.should.equal(postTask.text);
                should.exist(resp.body._id);
                createdId = resp.body._id;
                done();
            });
    })

    it("newly created task", done => {

        const text = "todo text";

        request(app)
            .get(`/tasks/${createdId}`)
            .expect(200)
            .end( (err, resp) => {

                if(err) {
                    done(err);
                }

                resp.body.text.should.equal(postTask.text);
                done();
            });
    })
        
    it("list all tasks", done => {

        request(app)
            .get(`/tasks`)
            .expect(200)
            .end( (err, resp) => {

                if(err) {
                    done(err);
                }

                resp.body.should.be.Array();
                resp.body.should.have.length(1);        
                resp.body[0].text.should.equal(postTask.text);
                done();
            });
    })

    it("update existing task", done => {

        const newText = "new text";

        request(app)
            .put(`/tasks/${createdId}`)
            .send({ text: newText})
            .expect(204)
            .end(done);
    })

    it("delete existing task", done => {

        request(app)
            .delete(`/tasks/${createdId}`)
            .expect(204)
            .end(done);
    })


    after("clear collection", done => {
        collection.remove({}, done);
        done();
    })

})