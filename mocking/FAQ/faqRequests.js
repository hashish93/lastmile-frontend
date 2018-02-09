module.exports = function () {
    return{
        getCount: getCount,
        getAll: getAll,
        getById: getById
    };
};
var data = require('./faqObjects.json');

function getCount(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"property": data.length}));
}
function getAll(req, res) {
    var body = '';
    var parsedBody;
    req.addListener('data', function (chunk) {
        body += chunk;
    });
    req.addListener('end', function (chunk) {
        if (chunk) {
            body += chunk;
        }
        parsedBody = JSON.parse(body);
        var myResponse = getAllProcessing(parsedBody);
        res.setHeader('Content-Type', 'application/json');
        res.send(myResponse);
    });
    function getAllProcessing(body) {
        var returnedArray;
        if (body.page === 0) {
            returnedArray = data;
        } else {
            var temp = body.maxResult * (body.page - 1);
            returnedArray = data.slice(temp, temp + body.maxResult);
        }
        return returnedArray;
    }
}
function getById(req, res) {
    var body = '';
    var parsedBody;
    req.addListener('data', function (chunk) {
        body += chunk;
    });
    req.addListener('end', function (chunk) {
        if (chunk) {
            body += chunk;
        }
        parsedBody = JSON.parse(body);
        var myResponse = getByIdProcessing(parsedBody);
        res.setHeader('Content-Type', 'application/json');
        res.send(myResponse);
    });
    function getByIdProcessing(body) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].requestId === body.id)
                return data[i];
        }
    }
}