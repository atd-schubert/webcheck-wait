/*jslint node:true*/
'use strict';

var WebcheckPlugin = require('webcheck/plugin');

var pkg = require('./package.json');
/**
 * A helper function for empty regular expressions
 * @private
 * @type {{test: Function}}
 */
var emptyFilter = {
    test: function () {
        return true;
    }
};


/**
 * Auto delaying plugin for webcheck.
 * @author Arne Schubert <atd.schubert@gmail.com>
 * @param {{}} [opts] - Options for this plugin
 * @param {number} [opts.delay=5000] - Delay in milliseconds
 * @param {number} [opts.deviation=0] - Deviation from delay in milliseconds
 * @param {RegExp|{test:Function}} [opts.filterUrl] - Follow only in matching url
 * @augments Webcheck.Plugin
 * @constructor
 */
var DelayPlugin = function (opts) {
    var self = this;

    opts = opts || {};
    WebcheckPlugin.apply(this, arguments);

    opts.filterUrl = opts.filterUrl || emptyFilter;

    this.delay = opts.delay || 5000;
    this.deviation = opts.deviation || 0;

    this.on.crawl = function (settings) {
        var delay;
        if (!opts.filterUrl.test(settings.url) || settings.wait) {
            return;
        }
        delay = self.delay + Math.floor((Math.random() * self.deviation) - (self.deviation / 2));
        if (self.last + delay < Date.now()) {
            self.last = Date.now();
            return;
        }
        self.last += delay;
        settings.wait = self.last - Date.now();
    };
};

DelayPlugin.prototype = {
    '__proto__': WebcheckPlugin.prototype,
    package: pkg,

    delay: 5000,
    deviation: 0,
    last: 0
};

module.exports = DelayPlugin;
