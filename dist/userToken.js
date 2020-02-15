"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var db_1 = require("./db");
var userStore = db_1.default.loadUsers();
var UserToken = /** @class */ (function () {
    function UserToken(id) {
        if (id.length >= 16)
            this.id = id;
    }
    UserToken.isValidUser = function (id) {
        for (var _i = 0, userStore_1 = userStore; _i < userStore_1.length; _i++) {
            var user = userStore_1[_i];
            if (id instanceof UserToken && id.matches(user.userToken) || typeof id === "string" && id === user.userToken)
                return true;
        }
        return false;
    };
    UserToken.fetchUserById = function (id) {
        if (id instanceof UserToken)
            return id.resolve();
        else
            new UserToken(id).resolve();
        return;
    };
    UserToken.prototype.resolve = function () {
        for (var _i = 0, _a = user_1.default.users; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.matchId(this))
                return user;
        }
        for (var _b = 0, userStore_2 = userStore; _b < userStore_2.length; _b++) {
            var user = userStore_2[_b];
            if (user.userToken === this || user.userToken === this.id)
                return user_1.default.construct(user);
        }
        return null;
    };
    UserToken.prototype.matches = function (id) {
        if (id instanceof UserToken)
            return id.id === this.id;
        else
            return this.id === id;
    };
    return UserToken;
}());
exports.default = UserToken;
//# sourceMappingURL=userToken.js.map