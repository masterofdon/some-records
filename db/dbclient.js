var exports = {};
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study';
const dbName = 'getir-case-study';

const mongoConfig = {
    useNewUrlParser: true,
};

const servererrors = require("../constants/servererrors");
const serverresps = require("../constants/serverresps");

const LANGS = ["EN", "TR"];
var prefLang = LANGS[0];

var dbConnection = undefined;

const connectToMongoDb = function (success , failure) {
    MongoClient.connect(url, mongoConfig, function (err, db) {
        if (err) {
            console.error(servererrors.db.err_0001[prefLang]);
            throw err;
        }

        dbConnection = db.db(dbName);
        if(success){
            success(dbConnection);
        }
        console.log(serverresps.db.resp_0001[prefLang]);
    });
}

const closeConnnection = function(){
    if(dbConnection){
        dbConnection.close();
        dbConnection = undefined;
    }
}

exports.connect = connectToMongoDb;
exports.close = closeConnnection;
exports.getDBConnection = () => {
    return dbConnection;
};

module.exports = exports;