/*jslint node: true */
"use strict";

/**
 * Created by Jcarlos on 10/02/2017.
 */

var express = require("express");
var Jimp = require("jimp");
var async = require("async");
var path = require("path");
var sizeOf = require("image-size");
var svg_to_png = require("svg-to-png");
var fs = require("fs");
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

module.exports = {
    /**
     * changeAttr.
     *
     * change attributes os an svg file .
     *
     * @return {string} image Path.

     * @param {string} image colour .
     * @param {string} svg image Path.
     * @param {function} cb callback.
     */
    changeAttr: function (colour, newWidth, svg, cb) {
        //check colour is a hexa code with regular expresion.
        var isHex = /(^[0-9A-Fa-f]{6}$)|(^[0-9A-Fa-f]{3}$)/;
        if (!isHex.test(colour)) {
            cb("Colour not hexadecimal", null);
            return null;
        }
        if (newWidth > 300) {
            cb("Maximum width is 300", null)
            return null;
        }

        fs.readFile(svg, "utf8", function (err, data) {
            if (err) {
                console.log(err, data);
                cb("Error reading file svg", null);
                return;
            }
            var svgFile = new DOMParser().parseFromString(data);
            svgFile.getElementById("1").setAttribute("fill", "#" + colour);
            var marker = svgFile.getElementById("marker");
            var height = marker.getAttribute("height");
            var witdh = marker.getAttribute("width");
            height = height.replace("px", "");
            witdh = witdh.replace("px", "");
            var newHeight = (height / witdh) * newWidth;
            if (newHeight === undefined || newWidth === undefined) {
                cb("height or width undefined", null);
                return null;
            }
            marker.setAttribute("width", newWidth + "px");
            marker.setAttribute("height", newHeight + "px");
            var newSvgFile = new XMLSerializer().serializeToString(svgFile);
            var filename = svg.replace(/^.*[\\\/]/, "");
            filename = filename.replace(".svg", "");
            filename = filename + "_" + colour + "_" + newWidth;
            filename = filename + ".svg";
            var pathFile = path.join(__dirname, filename);
            fs.writeFile(pathFile, newSvgFile, function (err) {
                if (err) {
                    cb("Error writting file svg", null);
                    return null;
                }
                cb("", pathFile);
            });
        });

    },
    /**
     * convertSvgToPng.
     *
     * Convert svg file in a png.
     *
     * @return {string} png image path.

     * @param {string} svg image path
     * @param {function} cb callback
     */
    convertSvgToPng: function (svg, cb) {
        if (!fs.existsSync(svg)) {
            cb("Svg file doesn't exists", null);
            return;
        }
        svg_to_png.convert(svg, __dirname)
            .then(function () {
                var filename = svg.replace(/^.*[\\\/]/, "");
                filename = filename.replace(".svg", ".png");
                fs.unlink(svg, function () {
                    cb("", path.join(__dirname, filename));
                });
            }).catch(function (err) {
            if (err) {
                cb(err, null);
            }
        });
    },
    /**
     * It Creates an image with the text that is passed as a input
     *
     * @return {string} image path.

     * @param {string} text
     * @param {string} font font path
     * @param {function} cb callback
     */
    createTextImg: function (text, font, cb) {

        new Jimp(300, 300, function (err, image) {
            if (err) {
                cb(err, null);
                return
            }
            //load font of text in the marker (always .fnt)
            Jimp.loadFont(font).then(function (font) {
                image.print(font, 10, 10, text, function (err) {
                    if (err) {
                        cb(err, null);
                        return
                    }
                    var fileName = text.replace("-", "_") + ".png";
                    image.write(path.join(__dirname, fileName), function () {
                        cb("", path.join(__dirname, fileName));
                    });
                });
            }).catch(function (err) {
                if (err) {
                    cb(err, null);
                }
            });
        });
    },
    /**
     * It combines marker image and text image. Delete temporary files
     *
     * @return {string} image path.

     * @param {string} pngMarker image marker path
     * @param {string}  pngText image text path
     * @param {int} widthMarker width that you want in final image
     * @param {function} cb callback
     */
    combinePngs: function (pngMarker, pngText, fileName, cb) {

        if (!(fs.existsSync(pngMarker) && fs.existsSync(pngText))) {
            cb("Png file doesn't exist", null);
            return null;
        }

        var marker = Jimp.read(pngMarker);
        var text = Jimp.read(pngText);

        Promise.all([marker, text]).then(function (images) {
            var marker = images[0];
            var text = images[1];

            sizeOf(pngMarker, function (err, dimensions) {
                if (err) {
                    cb(err, null);
                    return null;
                }
                var heightMarker = dimensions.height;
                var widthMarker = dimensions.width;
                var widthText = widthMarker;
                var heightText = heightMarker / 5;
                text.autocrop(function (err) {
                    if (err) {
                        cb(err, null);
                        return null
                    }
                    text.contain(widthText, heightText, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
                    //put text center in marker
                    var widthPosition  = widthMarker / 2 - widthText / 2
                    var heightPosition = heightMarker / 3 - heightText / 2

                    marker.composite(text, widthPosition, heightPosition);
                    //delete temp files
                    fs.unlink(pngMarker, function () {
                        fs.unlink(pngText, function () {
                            //save in cache
                            var pathFile = path.join(__dirname, "cache", fileName)
                            marker.write(pathFile, function () {
                                cb("", pathFile);
                            });
                        });
                    });
                });
            });

        }).catch(function (err) {
            if (err) {
                cb(err, null);
            }
        });
    }
};

