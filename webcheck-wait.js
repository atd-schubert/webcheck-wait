"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var webcheck_1 = require("webcheck");
var pkg = require("./package.json");
/**
 * A helper function for empty regular expressions
 * @private
 * @type {{test: Function}}
 */
var emptyFilter = {
    test: function () {
        return true;
    },
};
/**
 * Auto delaying plugin for webcheck.
 * @author Arne Schubert <atd.schubert@gmail.com>
 * @param {{}} [opts] - Options for this plugin
 * @param {number} [opts.delay=5000] - Delay in milliseconds
 * @param {number} [opts.deviation=0] - Deviation from delay in milliseconds
 * @param {RegExp|{test:Function}} [opts.filterUrl] - Follow only in matching url
 * @augments Plugin
 * @constructor
 */
var WaitPlugin = /** @class */ (function (_super) {
    __extends(WaitPlugin, _super);
    function WaitPlugin(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.delay = 5000;
        _this.deviation = 0;
        _this.last = 0;
        _this.package = pkg;
        var urlFilter = opts.filterUrl || emptyFilter;
        _this.delay = opts.delay || 5000;
        _this.deviation = opts.deviation || 0;
        _this.on = {
            crawl: function (settings) {
                if (!urlFilter.test(settings.url) || settings.wait) {
                    return;
                }
                var delay = _this.delay + Math.floor((Math.random() * _this.deviation) - (_this.deviation / 2));
                if (_this.last + delay < Date.now()) {
                    _this.last = Date.now();
                    return;
                }
                _this.last += delay;
                settings.wait = _this.last - Date.now();
            },
        };
        return _this;
    }
    return WaitPlugin;
}(webcheck_1.Plugin));
exports.WaitPlugin = WaitPlugin;
//# sourceMappingURL=webcheck-wait.js.map