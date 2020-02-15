"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$";
var Key = /** @class */ (function () {
    function Key(length) {
        if (length === void 0) { length = 16; }
        this.characters = [];
        for (var i = 0; i < length; i++)
            this.characters.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    Key.prototype.toString = function () {
        return this.characters.join('');
    };
    return Key;
}());
exports.default = Key;
//# sourceMappingURL=key.js.map