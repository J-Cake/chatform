"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$";
var Key = /** @class */ (function () {
    function Key(length, seed) {
        if (length === void 0) { length = 16; }
        this.characters = [];
        this.seed = seed;
        this.length = length;
        function key() {
            var outputChars = [];
            if (seed && seed.length === length)
                for (var i = 0; i < length; i++)
                    outputChars.push(seed[(chars.indexOf(seed[Math.floor(Math.random() * chars.length)]) + 1) % chars.length]);
            else
                for (var i = 0; i < length; i++)
                    outputChars.push(chars[Math.floor(Math.random() * chars.length)]);
            return outputChars;
        }
        do {
            this.characters = key();
        } while (Key.keyList.includes(this.toString()));
        Key.keyList.push(this.toString());
    }
    Key.fromKey = function (key) {
        var output = new Key(key.length);
        var chars = [];
        for (var _i = 0, key_1 = key; _i < key_1.length; _i++) {
            var i = key_1[_i];
            chars.push(i);
        }
        output.characters = chars;
        return output;
    };
    Key.prototype.next = function () {
        var _this = this;
        if (this.seed) {
            var seedChars = [];
            for (var _i = 0, _a = this.seed; _i < _a.length; _i++) {
                var i = _a[_i];
                seedChars.push(i);
            }
            return new Key(this.length, seedChars.map(function (i, a) { return chars[(chars.indexOf(i) + (_this.length % a) + 1) % chars.length]; }).join(''));
        }
        else
            return new Key(this.length, this.characters.map(function (i) { return (chars.indexOf(i) + 1) % chars.length; }).join(''));
    };
    Key.prototype.toString = function () {
        return this.characters.join('');
    };
    Key.keyList = [];
    return Key;
}());
exports.default = Key;
//# sourceMappingURL=key.js.map