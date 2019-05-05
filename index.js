const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const validator = require("./validator/getir-validation");
const dbclient = require('./db/dbclient');
const servererrors = require("./constants/servererrors");
const serverresps = require("./constants/serverresps");

const LANGS = ["EN", "TR"];
var prefLang = LANGS[0];

const port = 8080;
const app = express();

dbclient.connect();

app.use(morgan('combined'));

app.use(bodyParser.json({ type: 'application/json' }));

// CONTROLLERS
app.post('/api/records', (req, res) => {
    const startDateVal = validator.ingressDateValidator(req.body.startDate);
    const endDateVal = validator.ingressDateValidator(req.body.endDate);
    const minCountVal = validator.countValidator(req.body.minCount);
    const maxCountVal = validator.countValidator(req.body.maxCount);
    if(!(startDateVal && endDateVal && minCountVal && maxCountVal)){
        res.status(400).send({ code : 401 , msg : servererrors.api.err_0001[prefLang] });
        return;
    }
    if((req.body.maxCount < req.body.minCount) || (req.body.startDate > req.body.endDate)){
        res.status(400).send({ code : 402 , msg : servererrors.api.err_0002[prefLang] });
        return;
    }
    if(!dbclient.getDBConnection()){
        res.status(500).send({ message : servererrors.db.err_0002[prefLang] });
        return;
    }
    const records = dbclient.getDBConnection().collection("records");
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

app.listen(process.env.PORT || port);
