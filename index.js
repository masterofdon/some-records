const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;

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

  MongoClient.connect(url , mongoConfig, function (err , db) {
    if (err) {
        console.error(servererrors.db.err_0001[prefLang]);
        throw err;
    }

    const dbConnection = db.db(dbName);
    console.log(serverresps.db.resp_0001[prefLang]);
    db.close();
});

app.use(morgan('combined'));

app.use((req, res, next) => setTimeout(next, 1000));

app.use(bodyParser.json({ type: 'application/json' }));

app.listen(port);