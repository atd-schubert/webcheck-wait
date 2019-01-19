import * as express from "express";
import * as freeport from "freeport";
import { Server } from "http";
import { Webcheck } from "webcheck";

import { WaitPlugin } from "../";

describe("Wait Plugin", () => {
    let port: number;
    let server: Server;
    before((done: Mocha.Done) => {
        const app = express();

        app.get("/", (req, res) => {
            res.set("Content-Type", "text/html").send(`<html><head></head><body>Test</body></html>`);
        });
        app.get("/second", (req, res) => {
            res.set("Content-Type", "text/html").send(`<html><head></head><body>Test</body></html>`);
        });

        freeport((err, p) => {
            if (err) {
                done(err);
            }
            port = p;
            server = app.listen(port);
            done();
        });
    });
    after((done: Mocha.Done) => {
        server.close(done);
    });
    describe("Delaying with deviation", () => {
        const webcheck = new Webcheck();
        const plugin: WaitPlugin = new WaitPlugin({
            delay: 3000,
            deviation: 1000,
        });
        let start: number;

        before(() => {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });

        it("should crawl a url directly", (done: Mocha.Done) => {
            start = Date.now();
            webcheck.once("result", () => {
                return done();
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/",
            }, (err?: Error | null) => {
                if (err) {
                    return done(err);
                }
            });
        });
        it("should crawl a second url with delay", (done: Mocha.Done) => {
            webcheck.once("result", () => {
                const end = Date.now();
                if (start + 2000 < end && start + 4000 > end) {
                    return done();
                }
                return done(new Error("Not waited"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/second",
            }, (err?: Error | null) => {
                if (err) {
                    return done(err);
                }
            });
        }).timeout(5000);
    });
    describe("Simple delaying", () => {
        const webcheck = new Webcheck();
        const plugin: WaitPlugin = new WaitPlugin({
            delay: 3000,
        });
        let start: number;

        before(() => {
            webcheck.addPlugin(plugin);
            plugin.enable();
        });

        it("should crawl a url directly", (done: Mocha.Done) => {
            start = Date.now();
            webcheck.once("result", () => {
                return done();
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/",
            }, (err?: Error | null) => {
                if (err) {
                    return done(err);
                }
            });
        });
        it("should crawl a second url with delay", (done: Mocha.Done) => {
            webcheck.once("result", () => {
                if (start + 3000 <= Date.now()) {
                    return done();
                }
                return done(new Error("Not waited"));
            });
            webcheck.crawl({
                url: "http://localhost:" + port + "/second",
            }, (err?: Error | null) => {
                if (err) {
                    return done(err);
                }
            });
        }).timeout(4000);
    });
});
