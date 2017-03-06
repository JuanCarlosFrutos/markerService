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
         res.status(404);
         res.json({ error: err.message })
         return;
    }

    //check get parameters
    if (req.query.colour === undefined || req.query.width === undefined ) {
        err = new Error("Colour or width undefined");
         res.status(404);
         res.json({ error: err.message })
         return;
    }

    var pathSvg = path.join(__dirname, '..' , 'assets' ,'marker.svg');
    var pathFont = path.join(__dirname, '..' , 'assets', 'markerLetters.fnt');
    var width = req.query.width;
    var colour = req.query.colour;
    var pathCache =  path.join(__dirname, "..", "cache");
    var fileName = "marker" + "_" + colour + "_" + width + "_" + req.params.text.replace("-", "_") +  ".png";
    var pathImage =path.join(pathCache, fileName);


    //if cache doesnt exist it will be created
    if(!fs.existsSync(pathCache)){
        fs.mkdirSync(pathCache);
    }

    if(fs.existsSync(pathImage)){
        res.status(201);
        res.sendFile(pathImage);
        return;
    }

        async.auto({


            changeAttr: function (cb) {
                marker.changeAttr(colour, parseInt(width), pathSvg, function (err, path) {
                    path !== null ? cb(null, path) : cb(err, null);
                });
            },

            convertSvgToPng: ["changeAttr", function (result, cb) {
                marker.convertSvgToPng(result.changeAttr, function (err, path) {
                    path !== null ? cb(null, path) : cb(err, null);
                });
            }],

            createTextImg: function (cb) {
                marker.createTextImg(req.params.text, pathFont, function (err, path) {
                    path !== null ? cb(null, path) : cb(err, null);
                });
            },

            combinePngs: ["createTextImg", "convertSvgToPng", function (result, cb) {
                marker.combinePngs(result.convertSvgToPng, result.createTextImg, fileName, function (err, path) {
                    path !== null ? cb(null, path) : cb(err, null);
                });
            }],

        }, function (err, results) {
            if (err) {
                res.status(404);
                res.json({ error: err })
            }else{
                res.status(201);
                res.sendFile(results.combinePngs);
            }
        });
});



module.exports = router;