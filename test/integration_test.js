/**
 * Created by Jcarlos on 04/02/2017.
 */

var expect  = require("chai").expect;
var request = require("request");
var server = require("../app");

describe("201 Created", function() {
        var url = "http://localhost:3000/marker/10-10?colour=000&width=82";
    describe("GET /marker/10-10?colour=000&width=82", function() {
        it("returns status 201", function(done) {
            this.timeout(4000);
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(201);
                done();
            });
        });
    });
});
describe("404 Not Found", function() {
        var url = "http://localhost:3000/marker";
    describe("GET /marker/", function() {
        it("returns status 404", function(done) {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});

