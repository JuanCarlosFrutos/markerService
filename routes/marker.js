/*jslint node: true */
"use strict";
/**
 * Created by Jcarlos on 30/01/2017.
 */

var marker = require("../markerService.js");
var express = require("express");
var router = express.Router();
var async = require("async");
var path = require("path");
var fs = require("fs");

/* GET users listing. */
router.get("/:text", function (req, res, next) {

    //check correct text
    var reg  = /^.{0,5}$/;
    if(!reg.test(req.params.text)) {
        var err = new Error("text maximum length is 5 ");
         err.status = 404;
         next(err);
         return;
    }
    //check get parameters
    if (req.query.colour === undefined || req.query.width === undefined ) {
        err = new Error("Colour or width undefined");
         err.status = 404;
         next(err);
         return;
    }
    var width = req.query.width;
    var colour = req.query.colour;
    async.auto({
        changeAttr: function (cb) {
            marker.changeAttr(colour,parseInt(width),"marker.svg", function (err,path) {
                path !== null ? cb(null,path) : cb(err,null);
            });
        },

        convertSvgToPng: ["changeAttr", function (result,cb) {
            marker.convertSvgToPng(result.changeAttr,function (err,path) {
                path !== null ? cb(null,path) : cb("Incorrect convertSvgToPng",null);
            });
        }],

        createTextImg: function (cb) {
            marker.createTextImg(req.params.text, "markerLetters.fnt", function (err,path) {
                path !== null ? cb(null,path) : cb("createTextImg",null);
            });
        },

        combinePngs: ["createTextImg", "convertSvgToPng", function (result,cb) {
            marker.combinePngs(result.convertSvgToPng, result.createTextImg, function (err,path) {
                path !== null ? cb(null,path) : cb("combinePngs",null);
            });
        }],

    }, function (err, results) {
        if (err) {
             err = new Error(err);
             err.status = 404;
             next(err);
            return;
        }
        res.status(201);
        setTimeout(function () {
           res.sendFile(results.combinePngs);
        }, 1000);
    });
});

module.exports = router;