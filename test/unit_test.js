/**
 * Created by Jcarlos on 11/02/2017.
 */
var express = require("express");
var path = require("path");
var expect  = require("chai").expect;
var marker = require("../markerService.js");
var fs = require( "fs" );

describe("Function changeAttr", function() {
    describe("Correct inputs", function() {
        it("inputs->ffffff,100,marker.svg", function (done) {

            var testPromise = new Promise(function (resolve, reject) {
                marker.changeAttr("ffffff", 100,"marker.svg", function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function (result) {
                try {
                    var path = fs.realpathSync("marker.svg", []);
                    expect(result).to.equal(path);
                    done();
                } catch (err) {
                    done(err);
                }
            }, done);
        });
    });
    describe("Incorrect inputs", function() {
        it("inputs->zzzzzz,100, marker.svg", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.changeAttr("zzzzzz",100,"marker.svg",function (err,path) {
                   resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                   // var path = fs.realpathSync("marker.svg", []);
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });

        it("inputs->ffffff,100, noexist.svg", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.changeAttr("ffffff",100,"noexist.svg",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                    // var path = fs.realpathSync("marker.svg", []);
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });

        it("inputs->ffffff,99999, marker.svg", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.changeAttr("ffffff",99999,"noexist.svg",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                    // var path = fs.realpathSync("marker.svg", []);
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
});

describe("Function createTextImage", function() {
    describe("Correct inputs", function() {
        it("inputs->test, markerLetters.fnt", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.createTextImg("test","markerLetters.fnt",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                    var path = fs.realpathSync("text.png", []);
                    expect(result).to.equal(path);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
    describe("Incorrect inputs", function() {
        it("inputs->test, markerLetters", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.createTextImg("test","markerLetters",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
        it("inputs->integer, markerLetters.fnt", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.createTextImg("test","markerLetters",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
});

describe("Function convertSvgToPng", function() {
    describe("Correct inputs", function() {
        it("inputs->marker.svg", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.convertSvgToPng(fs.realpathSync("marker.svg", []),function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                    var path = fs.realpathSync("marker.png", []);
                    expect(result).to.equal(path);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
    describe("Incorrect inputs", function() {
        it("inputs->noexist.svg", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.convertSvgToPng("noexist.svg",function (err,path) {
                    resolve(path);
                })
            });

            testPromise.then(function(result){
                try {
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
});

describe("Function combinePngs", function() {
    describe("Correct inputs", function() {
        it("inputs->marker.png,100,text.png", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.combinePngs(fs.realpathSync("marker.png"),fs.realpathSync("text.png"),function (err,path) {
                    resolve(path);
                });
            });

            testPromise.then(function(result){
                try {
                    // expect(result).to.equal("C:\\Users\\Jcarlos\\universidad\\APImarker\\directory\\text.png");
                    var path = fs.realpathSync("marker.png", []);
                    expect(result).to.equal(path);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
    describe("Incorrect inputs", function() {
        it("inputs->noexist,text.png", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.combinePngs("noexist",fs.realpathSync("text.png"),function (err,path) {
                    resolve(path);
                });
            });

            testPromise.then(function(result){
                try {
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
        // it("inputs->marker.png,99999,text.png", function(done) {
        //     var testPromise = new Promise(function(resolve, reject) {
        //         marker.combinePngs("marker.png",99999,fs.realpathSync("text.png"),function (path) {
        //             resolve(path);
        //         });
        //     });
        //
        //     testPromise.then(function(result){
        //         try {
        //             expect(result).to.equal(null);
        //             done();
        //         } catch(err) {
        //             done(err);
        //         }
        //     }, done);
        // });
        it("inputs->marker.png,noexist", function(done) {
            var testPromise = new Promise(function(resolve, reject) {
                marker.combinePngs("marker.png","noexist",function (err,path) {
                    resolve(path);
                });
            });

            testPromise.then(function(result){
                try {
                    expect(result).to.equal(null);
                    done();
                } catch(err) {
                    done(err);
                }
            }, done);
        });
    });
});

