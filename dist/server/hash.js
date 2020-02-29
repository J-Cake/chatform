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
    var saltRounds = Math.max(1, Math.min(salt, 99));
    for (var i = 0; i <= saltRounds; i++)
        hashHistory.push(hashRound(hashHistory[hashHistory.length - 1] || seed));
    return String(saltRounds).padStart(3, '0') + hashHistory[hashHistory.length - 1];
}
exports.default = hash;
//# sourceMappingURL=hash.js.map