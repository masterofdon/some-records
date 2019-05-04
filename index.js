const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const validator = require("./validator/getir-validation");

const url = 'mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study';

const dbName = 'getir-case-study';

const servererrors = require("./constants/servererrors");
const serverresps = require("./constants/serverresps");

const LANGS = ["EN", "TR"];
var prefLang = LANGS[0];

const port = 3000;
const app = express();

const mongoConfig = {
    useNewUrlParser: true,
};
var dbConnection = undefined;

MongoClient.connect(url, mongoConfig, function (err, db) {
    if (err) {
        console.error(servererrors.db.err_0001[prefLang]);
        throw err;
    }

    dbConnection = db.db(dbName);
    console.log(serverresps.db.resp_0001[prefLang]);
});

app.use(morgan('combined'));

app.use(bodyParser.json({ type: 'application/json' }));

// CONTROLLERS
app.post('/api/records', (req, res) => {
    const startDateVal = validator.ingressDateValidator(req.body.startDate);
    const endDateVal = validator.ingressDateValidator(req.body.endDate);
    const minCountVal = validator.countValidator(req.body.minCount);
    const maxCountVal = validator.countValidator(req.body.maxCount);
    if(!(startDateVal && endDateVal && minCountVal && maxCountVal)){
        res.status = 400;
        res.json({ message : "Error in Request Params"});
        return;
    }
    if(req.body.maxCount < req.body.minCount){
        res.status = 400;
        res.json({ message : "maxCount Should Be Greater Than minCount"});
        return;
    }
    if(!dbConnection){
        res.status = 500;
        res.json({ message : "Not Connected To Database"});
        return;
    }
    const records = dbConnection.collection("records");
    records.aggregate([
        { $match: { "createdAt": { $gte: new Date(`${req.body.startDate}T00:00:00.000Z`) } } },
        { $match: { "createdAt": { $lt: new Date(`${req.body.endDate}T00:00:00.000Z`) } } },
        {
            $project: {
                _id : 0,
                key : 1,
                createdAt: 1,
                totalCount: { $sum: "$counts" },
            }
        },
        { $match: { "totalCount": { $gte: req.body.minCount } } },
        { $match: { "totalCount": { $lte: req.body.maxCount } } },
    ]).toArray((err, docs) => {
        res.json({ 
            code : 0,
            msg : "success",
            records : docs
        });
    });
    // Maybe a timeout and alarm here.
});

app.listen(port);