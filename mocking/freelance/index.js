var freelanceRouter = require('express').Router();
var freelanceRequest = require('./freelanceRequest')();
freelanceRouter.post('/get-all', freelanceRequest.getAll);
freelanceRouter.post('/get-count', freelanceRequest.getCount);
freelanceRouter.post('/get-by-id', freelanceRequest.getById);
module.exports = freelanceRouter;