var FAQReqRouter = require('express').Router();
var FAQRequest = require('./faqRequests')();
FAQReqRouter.post('/get-all', FAQRequest.getAll);
FAQReqRouter.post('/get-count', FAQRequest.getCount);
FAQReqRouter.post('/get-by-id', FAQRequest.getById);
module.exports = FAQReqRouter;