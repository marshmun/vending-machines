const app = require('../app')
const assert = require("assert")
const request = require("supertest")

describe("GET /api/customer/items", function () {
    it("should return successfully", function (done) {
        request(app)
            .get("/api/customer/items")   // returns a promise
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                assert.equal(res.body['status'], "success");
            })
            .end(done);
    });
});
describe("POST /api/vendor/items", function () {
    it("should return successfully", function (done) {
        request(app)
            .post("/api/vendor/items")   // returns a promise
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                assert.equal(res.body['status'], "success");
            })
            .end(done);
    });
});
describe("PUT /api/vendor/items/itemId", function () {
    it("should return successfully", function (done) {
        request(app)
            .put("/api/vendor/items/itemId")   // returns a promise
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                assert.equal(res.body['status'], "success");
            })
            .end(done);
    });
});