"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SourceMaps = require("source-map-support");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");
var morgan = require("morgan");
var routes_1 = require("./routes");
SourceMaps.install();
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(routes_1.default);
var port = Number(process.argv[2]) || Number(process.env.PORT) || 9052;
app.listen(port, function () {
    console.log("Listening on " + port);
});
//# sourceMappingURL=index.js.map