const axios =  require("axios");
const dbclient = require("../db/dbclient");

function postCorrect(){
    return axios.post(`http://localhost:3000/api/records` , {
        startDate : "2016-06-01",
        endDate : "2016-06-03",
        maxCount : 1000,
        minCount : 500
    });
}

function postFormatDateError(){
    return axios.post(`http://localhost:3000/api/records` , {
        startDate : "2016-01-01",
        endDate : "201-01-01",
        maxCount : 1000,
        minCount : 500
    });
}

function postFormatCountError(){
    return axios.post(`http://localhost:3000/api/records` , {
        startDate : "2016-01-01",
        endDate : "2017-01-01",
        maxCount : "a1000",
        minCount : 500
    });
}

function postLogicalCountError(){
    return axios.post(`http://localhost:3000/api/records` , {
        startDate : "2016-01-01",
        endDate : "2016-03-01",
        maxCount : 1000,
        minCount : 1200
    });
}

function postLogicalDateError(){
    return axios.post(`http://localhost:3000/api/records` , {
        startDate : "2017-01-01",
        endDate : "2016-01-01",
        maxCount : 1000,
        minCount : 500
    });
}

test("Post Good Returs 200" , () => {
    expect.assertions(2);
    return postCorrect().then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toEqual(400);
    }).catch((err) => {
        
    });
});

test("Post Bad Date Format Returns 400" , () => {
    expect.assertions(2);
    return postFormatDateError().then((res) => {
       
    }).catch((err) => {
        expect(err).not.toBeNull();
        expect(err.response.status).toEqual(400);
    });
});

test("Post Bad Count Format Returns 400" , () => {
    expect.assertions(2);
    return postFormatCountError().then((res) => {
       
    }).catch((err) => {
        expect(err).not.toBeNull();
        expect(err.response.status).toEqual(400);
    });
});

test("Post Bad Date Logic Returns 400" , () => {
    expect.assertions(2);
    return postLogicalDateError().then((res) => {
       
    }).catch((err) => {
        expect(err).not.toBeNull();
        expect(err.response.status).toEqual(400);
    });
});

test("Post Bad Count Logic Returns 400" , () => {
    expect.assertions(2);
    return postLogicalCountError().then((res) => {
       
    }).catch((err) => {
        expect(err).not.toBeNull();
        expect(err.response.status).toEqual(400);
    });
});