"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function hash(seed, salt) {
    var hashRound = function (hash) {
        var hashStream = crypto.createHash('sha256');
        hashStream.update(hash);
        return hashStream.digest('hex');
    };
    var hashHistory = [];
    for (var i = 0; i <= salt; i++)
        hashHistory.push(hashRound(hashHistory[hashHistory.length - 1] || seed));
    return hashHistory[hashHistory.length - 1];
}
exports.default = hash;
//# sourceMappingURL=hash.js.map