/*jslint node:true*/

/*global describe, it, before, after, beforeEach, afterEach*/

'use strict';

var WaitPlugin = require('../');


var Webcheck = require('webcheck');
var freeport = require('freeport');
var express = require('express');

describe('Wait Plugin', function () {
    var port;
    before(function (done) {
        var app = express();

        /*jslint unparam: true*/
        app.get('/', function (req, res) {
            res.set('Content-Type', 'text/html').send('<html><head></head><body>Test</body></html>');
        });
        app.get('/second', function (req, res) {
            res.set('Content-Type', 'text/html').send('<html><head></head><body>Test</body></html>');
        });
        /*jslint unparam: false*/

        freeport(function (err, p) {
            if (err) {
                done(err);
            }
            port = p;
            app.listen(port);
            done();
        });
    });
    describe('Delaying with deviation', function () {
        var webcheck, plugin, start;

        before(function () {
            webcheck = new Webcheck();
            plugin = new WaitPlugin({
                delay: 3000,
                deviation: 1000
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });

        it('should crawl a url directly', function (done) {
            start = Date.now();
            webcheck.once('result', function () {
                return done();
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
        it('should crawl a second url with delay', function (done) {
            this.timeout(5000);
            webcheck.once('result', function () {
                var end = Date.now();
                if (start + 2000 < end && start + 4000 > end) {
                    return done();
                }
                return done(new Error('Not waited'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/second'
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
    });
    describe('Simple delaying', function () {
        var webcheck, plugin, start;

        before(function () {
            webcheck = new Webcheck();
            plugin = new WaitPlugin({
                delay: 3000
            });
            webcheck.addPlugin(plugin);
            plugin.enable();
        });

        it('should crawl a url directly', function (done) {
            start = Date.now();
            webcheck.once('result', function () {
                return done();
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/'
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
        it('should crawl a second url with delay', function (done) {
            this.timeout(4000);
            webcheck.once('result', function () {
                if (start + 3000 <= Date.now()) {
                    return done();
                }
                return done(new Error('Not waited'));
            });
            webcheck.crawl({
                url: 'http://localhost:' + port + '/second'
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });
        });
    });
});
