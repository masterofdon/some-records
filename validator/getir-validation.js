var exports = {};
// REF:#1
const isNull = (e) => { return e == null || e == 'undefined'};

const ingressDateValidator = function (dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

const countValidator = function (value) {
    return /^\d*$/.test(value)
}

exports.ingressDateValidator = ingressDateValidator;
exports.countValidator = countValidator;

module.exports = exports;

//#1 : https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript , 2019-05-04 17:13