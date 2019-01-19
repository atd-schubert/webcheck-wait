import { ICrawlOptions, Plugin } from "webcheck";
import pkg = require("./package.json");

export interface ISimplifiedRegExpr {
    test(txt: string): boolean;
}

export interface IWaitPluginOptions {
    delay?: number;
    deviation?: number;
    filterUrl?: ISimplifiedRegExpr;
}

/**
 * A helper function for empty regular expressions
 * @private
 * @type {{test: Function}}
 */
const emptyFilter: ISimplifiedRegExpr = { // a spoofed RegExpr...
    test: (): boolean => {
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
export class WaitPlugin extends Plugin {
    public delay: number = 5000;
    public deviation: number = 0;
    public last: number = 0;
    public package = pkg;
    constructor(opts: IWaitPluginOptions = {}) {
        super();

        const urlFilter = opts.filterUrl || emptyFilter;
        this.delay = opts.delay || 5000;
        this.deviation = opts.deviation || 0;

        this.on = {
            crawl: (settings: ICrawlOptions): void => {
                if (!urlFilter.test(settings.url) || settings.wait) {

                    return;
                }
                const delay = this.delay + Math.floor((Math.random() * this.deviation) - (this.deviation / 2));
                if (this.last + delay < Date.now()) {
                    this.last = Date.now();
                    return;
                }
                this.last += delay;
                settings.wait = this.last - Date.now();
            },
        };
    }
}
