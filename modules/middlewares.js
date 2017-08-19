'use strict';

const errors = require('./errors');

function errorMiddleware(err, req, res, next) {

  if (err instanceof errors.NotFoundError) {
    return res.status(404).json(err);
  }

  if (err instanceof errors.InvalidContentType) {
    return res.status(415).json(err);
  }

  if (err instanceof errors.BadRequest) {
    return res.status(400).json(err);
  }

  console.error("Unknown error occurred. ", err);
  res.status(500).json(new errors.InternalError("Internal Error occurred"));
}

function jsonContentMiddleware(req, res, next) {

  if (req.headers['content-type'] !== 'application/json') {
    next(new errors.InvalidContentType("Supported content type is application/json"));
  }

  return next();
}

module.exports.errorMiddleware = errorMiddleware
module.exports.jsonContentMiddleware = jsonContentMiddleware