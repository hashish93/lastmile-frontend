var routes = require('express').Router();
var returnReq = require('./returnRequests');
var deliveryReq = require('./deliveryRequest');
var faqReq = require('./FAQ');
var freelanceReq = require('./freelance');
var offloadingReq = require('./offloading');

routes.use('/return-req', returnReq);
routes.use('/delivery-req', deliveryReq);
routes.use('/FAQ',faqReq);
routes.use('/freelance',freelanceReq);
routes.use('/offloading',offloadingReq);

module.exports = routes;