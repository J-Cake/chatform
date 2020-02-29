"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var userToken_1 = require("./userToken");
var db_1 = require("./db");
var hash_1 = require("./hash");
var ChatFilter;
(function (ChatFilter) {
    ChatFilter[ChatFilter["alphabetical"] = 0] = "alphabetical";
    ChatFilter[ChatFilter["counterAlphabetical"] = 1] = "counterAlphabetical";
    ChatFilter[ChatFilter["mostRecentActivity"] = 2] = "mostRecentActivity";
    ChatFilter[ChatFilter["leastRecentActivity"] = 3] = "leastRecentActivity";
    ChatFilter[ChatFilter["newest"] = 4] = "newest";
    ChatFilter[ChatFilter["oldest"] = 5] = "oldest";
})(ChatFilter = exports.ChatFilter || (exports.ChatFilter = {}));
exports.ChatFilters = (_a = {},
    _a[ChatFilter.alphabetical] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a[ChatFilter.counterAlphabetical] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a[ChatFilter.mostRecentActivity] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a[ChatFilter.leastRecentActivity] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a[ChatFilter.newest] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a[ChatFilter.oldest] = function (i, j) { return i.name < j.name ? 1 : -1; },
    _a);
var ChatOwner;
(function (ChatOwner) {
    ChatOwner[ChatOwner["mine"] = 0] = "mine";
    ChatOwner[ChatOwner["notMine"] = 1] = "notMine";
    ChatOwner[ChatOwner["both"] = 2] = "both";
})(ChatOwner = exports.ChatOwner || (exports.ChatOwner = {}));
var User = /** @class */ (function () {
    function User(token) {
        this.userToken = token;
        this.details = {
            email: '',
            displayName: '',
            following: [],
            id: ''
        };
        this.ownedChats = [];
        this.memberChats = [];
    }
    User.loadUsers = function () {
        var userStore = db_1.default.loadUsers();
        var users = [];
        try {
            for (var _i = 0, userStore_1 = userStore; _i < userStore_1.length; _i++) {
                var pseudoUser = userStore_1[_i];
                users.push(User.construct(pseudoUser));
            }
        }
        catch (err) {
            return;
        }
        finally {
            User.users = users;
        }
    };
    User.resolveFromCredentials = function (email, clientSecret) {
        this.loadUsers();
        for (var _i = 0, _a = User.users; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.details.email === email)
                if (clientSecret && user.cipherPassword === clientSecret)
                    return user;
                else if (!clientSecret)
                    return user;
        }
        return null;
    };
    User.construct = function (pseudoUser) {
        var email = pseudoUser.email, displayName = pseudoUser.displayName, ownedChats = pseudoUser.ownedChats, userToken = pseudoUser.userToken, memberChats = pseudoUser.memberChats, following = pseudoUser.following, clientSecret = pseudoUser.clientSecret, publicToken = pseudoUser.publicToken;
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
        user.details.following = following.map(function (i) { return i instanceof userToken_1.default ? i : new userToken_1.default(i, true); }).filter(function (i) {
            console.log(i);
            return !!i.resolve();
            // return UserToken.isValidUser(i);
        });
        user.details.id = publicToken;
        user.cipherPassword = clientSecret;
        return user;
    };
    User.prototype.listChats = function (filter, list) {
        if (list === void 0) { list = ChatOwner.both; }
        if (list === ChatOwner.mine)
            return this.ownedChats.sort(exports.ChatFilters[ChatFilter.alphabetical]);
        else if (list === ChatOwner.notMine)
            return this.memberChats.sort(exports.ChatFilters[filter]);
        else if (list === ChatOwner.both)
            return __spreadArrays(this.ownedChats, this.memberChats).sort(exports.ChatFilters[filter]);
        else
            return [];
    };
    User.prototype.matchPassword = function (rawPassword) {
        var saltRounds = Number(this.cipherPassword.slice(0, 3));
        return hash_1.default(rawPassword, saltRounds) === this.cipherPassword;
    };
    User.prototype.joinChat = function (chatId) {
    };
    User.prototype.createChat = function (chatId) {
    };
    User.prototype.matchId = function (foreignId) {
        return foreignId.matches(this.userToken);
    };
    User.prototype.export = function () {
        db_1.default.saveUser(this);
    };
    User.users = [];
    User.filters = exports.ChatFilters;
    User.filterNames = ChatFilter;
    return User;
}());
exports.default = User;
//# sourceMappingURL=user.js.map