const validator = require("../validator/getir-validation");

test("Format YYYY-MM-DD should pass" , () => {
    expect(validator.ingressDateValidator("2016-03-10")).toBeTruthy();
});

test("Format Oher Than YYYY-MM-DD should not pass" , () => {
    expect(validator.ingressDateValidator("201-03-10")).toBeFalsy();
    expect(validator.ingressDateValidator("2016-3-10")).toBeFalsy();
    expect(validator.ingressDateValidator("2016/03/10")).toBeFalsy();
});

test("Incorrect dates should not pass" , () => {
    expect(validator.ingressDateValidator("2016-04-31")).toBeFalsy();
});

test("Counts should be an integer" , () => {
    expect(validator.countValidator(249)).toBeTruthy();
    expect(validator.countValidator(130.01)).toBeFalsy();
    expect(validator.countValidator("13402")).toBeTruthy();
    expect(validator.countValidator("a1029")).toBeFalsy();
});