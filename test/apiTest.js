const assert = require("assert");
const request = require("supertest");
const app = require("../app");
const Item = require("../models/item");
const Transaction = require("../models/purchase")
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

describe("vending machine crud routes", function (done) {
    //GETS

    describe("GET /api/customer/items", function () {
        it("should return successfully", function (done) {
            request(app)
                .get("/api/customer/items")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body["status"], "success");
                })
                .end(done);
        });
    });

    describe("GET /api/vendor/money", function () {
        it("should return successfully", function (done) {
            request(app)
                .get("/api/customer/items")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body["status"], "success");
                })
                .end(done);
        });
    });

    //POSTS

    describe("posting new data", function () {
        var newRecord;
        afterEach("delete the created record", function (done) {
            request(app)
                .delete(`/api/vendor/items/delete/${newRecord._id}`)
                .end(done);
        });

        describe("POST /api/vendor/items", function () {
            it("should return successfully", function (done) {
                request(app)
                    .post("/api/vendor/items")
                    .send({ item: "apple", cost: 5, quantity: 10 })
                    .expect(200)
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(function (res) {
                        newRecord = res.body.record;
                        assert.equal(res.body["status"], "success");
                    })
                    .end(done);
            });
        });
    });

    describe("posting new data", function () {
        var newRecord;
        var newTransaction;
        var money = 15;

        beforeEach("create the post", function (done) {
            request(app)
                .post("/api/vendor/items")
                .send({ item: "apple", cost: 5, quantity: 10 })
                .expect(function (res) {
                    newRecord = res.body.record;
                })
                .end(done);
        });
        afterEach("delete the created record", function (done) {
            request(app)
                .delete(`/api/vendor/items/delete/${newRecord._id}`)
                .end(done);
        });

        afterEach("delete the created transaction", function (done) {
            request(app)
                .delete(`/api/vendor/purchase/delete/${newTransaction}`)
                .end(done);
        });

        describe("POST /api/customer/:id/:money", function () {
            it("should return successfully", function (done) {
                request(app)
                    .post(`/api/customer/${newRecord._id}/${money}`)
                    .expect(200)
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(function (res) {
                        newTransaction = res.body.purchase_id;

                        assert.equal(res.body["status"], "success");
                    })
                    .end(done);
            });
        });
    });

    //PUTS

    describe("updating information", function () {
        var newRecord;
        beforeEach("create the post", function (done) {
            request(app)
                .post("/api/vendor/items")
                .send({ item: "apple", cost: 5, quantity: 10 })
                .expect(function (res) {
                    newRecord = res.body.record;
                })
                .end(done);
        });

        afterEach("delete the created record", function (done) {
            request(app)
                .delete(`/api/vendor/items/delete/${newRecord._id}`)
                .end(done);
        });

        describe("PUT /api/vendor/items/:id", function () {
            it("should return successfully", function (done) {
                request(app)
                    .put(`/api/vendor/items/${newRecord._id}`)
                    .send({ cost: 15 })
                    .expect(200)
                    .expect("Content-Type", "application/json; charset=utf-8")
                    .expect(function (res) {
                        assert.equal(res.body["status"], "success");
                    })
                    .end(done);
            });
        });
    });
});