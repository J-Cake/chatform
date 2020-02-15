"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userToken_1 = require("./userToken");
var db_1 = require("./db");
var User = /** @class */ (function () {
    function User(token) {
        this.userToken = token;
    }
    User.loadUsers = function () {
        var userStore = db_1.default.loadUsers();
        for (var _i = 0, userStore_1 = userStore; _i < userStore_1.length; _i++) {
            var pseudoUser = userStore_1[_i];
            User.users.push(User.construct(pseudoUser));
        }
    };
    User.resolveFromCredentials = function (email, clientSecret) {
        this.loadUsers();
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.details.email === email)
                if (user.cipherPassword === clientSecret)
                    return user;
        }
        return null;
    };
    User.construct = function (pseudoUser) {
        var email = pseudoUser.email, displayName = pseudoUser.displayName, ownedChats = pseudoUser.ownedChats, userToken = pseudoUser.userToken, memberChats = pseudoUser.memberChats, followers = pseudoUser.followers;
        var user = new User(userToken instanceof userToken_1.default ? userToken : new userToken_1.default(userToken));
        for (var _i = 0, memberChats_1 = memberChats; _i < memberChats_1.length; _i++) {
            var chat = memberChats_1[_i];
            user.joinChat(chat);
        }
        for (var _a = 0, ownedChats_1 = ownedChats; _a < ownedChats_1.length; _a++) {
            var chat = ownedChats_1[_a];
            user.createChat(chat);
        }
        user.details.email = email;
        user.details.displayName = displayName;
        user.details.followers = followers;
        return user;
    };
    User.prototype.joinChat = function (chatId) {
    };
    User.prototype.createChat = function (chatId) {
    };
    User.prototype.matchId = function (foreignId) {
        return foreignId.matches(this.userToken);
    };
    User.users = [];
    return User;
}());
exports.default = User;
//# sourceMappingURL=user.js.map