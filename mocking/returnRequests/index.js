var returnReqRouter = require('express').Router();
var returnRequest = require('./returnRequest')();
returnReqRouter.post('/get-all', returnRequest.getAll);
returnReqRouter.post('/get-count', returnRequest.getCount);
returnReqRouter.post('/get-by-id', returnRequest.getById);
module.exports = returnReqRouter;