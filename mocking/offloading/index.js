var offloadinfRouter = require('express').Router();
var offloadingRequest = require('./offloadingRequest')();
offloadinfRouter.post('/get-all', offloadingRequest.getAll);
offloadinfRouter.post('/get-count', offloadingRequest.getCount);
offloadinfRouter.post('/get-by-id', offloadingRequest.getById);
module.exports = offloadinfRouter;