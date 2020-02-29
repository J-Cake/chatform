"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var db_1 = require("./db");
var key_1 = require("./key");
var userStore = db_1.default.loadUsers();
var UserToken = /** @class */ (function () {
    function UserToken(id, isPublicKey) {
        if (isPublicKey === void 0) { isPublicKey = false; }
        if (id.length >= 16)
            this.id = id;
        this.isPublicKey = isPublicKey;
    }
    Object.defineProperty(UserToken.prototype, "key", {
        get: function () {
            return key_1.default.fromKey(this.id);
        },
        enumerable: true,
        configurable: true
    });
    UserToken.isValidUser = function (id, searchPublicKey) {
        if (searchPublicKey === void 0) { searchPublicKey = false; }
        for (var _i = 0, userStore_1 = userStore; _i < userStore_1.length; _i++) {
            var user = userStore_1[_i];
            if (id instanceof UserToken) {
                if (searchPublicKey) {
                    if (id.matches(user.userToken))
                        return true;
                }
                else {
                    if (id.matches(user.publicToken))
                        return true;
                }
            }
            else {
                if (searchPublicKey) {
                    if (id === user.publicToken)
                        return true;
                }
                else {
                    if (id === user.userToken)
                        return true;
                }
            }
        }
        return false;
    };
    UserToken.fetchUserById = function (id) {
        if (id instanceof UserToken)
            return id.resolve();
        else
            return new UserToken(id).resolve();
    };
    UserToken.prototype.resolve = function () {
        for (var _i = 0, _a = user_1.default.users; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.matchId(this))
                return user;
        }
        for (var _b = 0, userStore_2 = userStore; _b < userStore_2.length; _b++) {
            var user = userStore_2[_b];
            if (this.isPublicKey && user.publicToken === this.id)
                return user_1.default.construct(user);
            else if (user.userToken === this || user.userToken === this.id)
                return user_1.default.construct(user);
        }
        return null;
    };
    UserToken.prototype.matches = function (id) {
        var token = id instanceof UserToken ? id.id : id;
        return token === this.id;
    };
    return UserToken;
}());
exports.default = UserToken;
//# sourceMappingURL=userToken.js.map