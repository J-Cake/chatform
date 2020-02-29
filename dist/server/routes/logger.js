"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function logger(e) {
    var date = new Date();
    console.error(e);
    fs.appendFileSync(path.join(process.cwd(), date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + ".err"), e.stack);
}
exports.logger = logger;
//# sourceMappingURL=logger.js.map