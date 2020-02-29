"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
function default_1(port) {
    var server = http.createServer(function (req, res) {
        res.writeHead(101, {
            Upgrade: "websocket",
            Connection: "Upgrade",
            port: port
        });
        res.end(port);
    });
    server.listen(port, function () {
        console.log("Daemon HTTP Process: Active on", port);
    });
    return server;
}
exports.default = default_1;
//# sourceMappingURL=http.js.map