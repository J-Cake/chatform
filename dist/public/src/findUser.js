"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var StateManager = require("./state/stateManager");
function findUser() {
    var textField = this.container.querySelector("#username-search");
    var userList = this.container.querySelector(".people");
    var onChange = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var users, newUsers, existing, _i, _a, child, _loop_1, _b, users_1, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, http_1.default("/api/users?user=" + textField.value, http_1.Result.json)];
                    case 1:
                        users = (_c.sent()).message;
                        newUsers = users.map(function (i) { return i.userId; });
                        existing = [];
                        for (_i = 0, _a = userList.children; _i < _a.length; _i++) {
                            child = _a[_i];
                            if (!newUsers.includes(child.getAttribute("data-id")))
                                child.remove();
                        }
                        _loop_1 = function (user) {
                            if (userList.querySelector("[data-id=\"" + user.userId + "\"]") === null) {
                                var userContainer_1 = document.createElement("div");
                                userContainer_1.classList.add('user-list');
                                userContainer_1.innerHTML = "<div class=\"name\" data-id=\"" + user.userId + "\">" + user.userName + "</div>"; // add things in here
                                userContainer_1.addEventListener("click", function () {
                                    StateManager.dispatch("updateFriendList", {});
                                    http_1.default("/api/friend?user=" + user.userId, http_1.Result.json, http_1.Method.put).then(function (response) {
                                        if (response.code === 0) {
                                            userContainer_1.innerHTML = 'Friend added';
                                            userContainer_1.classList.add('fade');
                                            setTimeout(function () { return userContainer_1.remove(); }, 2000);
                                        }
                                        else {
                                            userContainer_1.classList.add('error');
                                            setTimeout(function () { return userContainer_1.classList.remove('error'); });
                                        }
                                    });
                                });
                                userList.appendChild(userContainer_1);
                            }
                        };
                        for (_b = 0, users_1 = users; _b < users_1.length; _b++) {
                            user = users_1[_b];
                            _loop_1(user);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    textField.addEventListener("input", onChange);
}
exports.default = findUser;
//# sourceMappingURL=findUser.js.map