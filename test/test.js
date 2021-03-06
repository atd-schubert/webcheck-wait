"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var freeport = require("freeport");
var webcheck_1 = require("webcheck");
var __1 = require("../");
describe("Wait Plugin", function () {
    var port;
    var server;
    before(function (done) {
        var app = express();
        app.get("/", function (req, res) {
            res.set("Content-Type", "text/html").send("<html><head></head><body>Test</body></html>");
        });
        app.get("/second", function (req, res) {
            res.set("Content-Type", "text/html").send("<html><head></head><body>Test</body></html>");
        });
        freeport(function (err, p) {
            if (err) {
                done(err);
            }
            port = p;
            server = app.listen(port);
            done();
        });
    });
    after(function (done) {
        server.close(done);
    });
    describe("Delaying with deviation", function () {
        var webcheck = new webcheck_1.Webcheck();
        var plugin = new __1.WaitPlugin({
            delay: 3000,
            deviation: 1000,
        });
        var start;
        before(function () {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it("should crawl a url directly", function (done) {
            start = Date.now();
            webcheck.once("result", function () {
                return done();
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/",
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
        it("should crawl a second url with delay", function (done) {
            webcheck.once("result", function () {
                var end = Date.now();
                if (start + 2000 < end && start + 4000 > end) {
                    return done();
                }
                return done(new Error("Not waited"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/second",
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        }).timeout(5000);
    });
    describe("Simple delaying", function () {
        var webcheck = new webcheck_1.Webcheck();
        var plugin = new __1.WaitPlugin({
            delay: 3000,
        });
        var start;
        before(function () {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });
        it("should crawl a url directly", function (done) {
            start = Date.now();
            webcheck.once("result", function () {
                return done();
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/",
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
        it("should crawl a second url with delay", function (done) {
            webcheck.once("result", function () {
                if (start + 3000 <= Date.now()) {
                    return done();
                }
                return done(new Error("Not waited"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/second",
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        }).timeout(4000);
    });
});
//# sourceMappingURL=test.js.map