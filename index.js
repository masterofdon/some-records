const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const validator = require("./validator/getir-validation");
const dbclient = require('./db/dbclient');

const port = 80;
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
        res.status(400).send({ message : "Format Error in Request Body"});
        return;
    }
    if((req.body.maxCount < req.body.minCount) || (req.body.startDate > req.body.endDate)){
        res.status(400).send({ message : "Logical Error in Request Body" });
        return;
    }
    if(!dbclient.getDBConnection()){
        res.status = 500;
        res.json({ message : "Not Connected To Database"});
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

app.listen(port);
