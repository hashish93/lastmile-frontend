var deliveryReqRouter = require('express').Router();
var deliveryRequest = require('./deliveryRequest')();
deliveryReqRouter.post('/get-all', deliveryRequest.getAll);
deliveryReqRouter.post('/get-count', deliveryRequest.getCount);
deliveryReqRouter.post('/get-by-id', deliveryRequest.getById);
module.exports = deliveryReqRouter;