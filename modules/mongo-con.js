'use strict';

const MongoClient = require('mongodb').MongoClient

function init(config) {

    return MongoClient
        .connect(config.url)
        .then( db => db.collection(config.collection))
        .catch(err => console.log("could not connect to mongo db. Details: ", err));
}

module.exports.init = init;
