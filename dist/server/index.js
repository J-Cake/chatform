"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SourceMaps = require("source-map-support");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");
var morgan = require("morgan");
var update_daemon_1 = require("./update_server/src/update_daemon");
var routes_1 = require("./routes/routes");
var api_1 = require("./routes/api");
SourceMaps.install();
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(routes_1.default);
app.use('/api', api_1.default);
var port = Number(process.argv[2]) || Number(process.env.PORT) || 9052;
app.listen(port, function () {
    console.log("Server: Listening on " + port);
});
var initialiseUpdateDaemon = JSON.parse(process.env.DAEMON || "true");
var upgrade = !!process.env.OBSERVER || false;
// Initialise the daemon unless specified
if (initialiseUpdateDaemon) {
    console.log("Daemon: Initialising Daemon");
    var externalURL = "ws://detnsw-chat-update-server.herokuapp.com/";
    // const externalURL = "ws://localhost:1920";
    update_daemon_1.default(externalURL).then(function () {
        console.log("Daemon: Running");
    });
}
else {
    console.log('DAEMON: Ignoring Daemon');
}
//# sourceMappingURL=index.js.map