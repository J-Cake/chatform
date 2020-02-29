"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userToken_1 = require("./userToken");
var message_1 = require("./message");
var key_1 = require("./key");
var db_1 = require("./db");
var Chat = /** @class */ (function () {
    function Chat(id) {
        if (id && id.length >= 16)
            this.id = id;
        else
            this.id = new key_1.default().toString();
    }
    Chat.resolve = function (id) {
        return db_1.default.loadChat(id);
    };
    Chat.prototype.load = function (chat) {
        this.name = chat.chatName;
        this.members = chat.members.map(function (i) { return new userToken_1.default(i); });
        this.owner = chat.owner;
        this.messages = chat.messages.map(function (i) { return message_1.default.construct(i); });
        return this;
    };
    return Chat;
}());
exports.default = Chat;
//# sourceMappingURL=chat.js.map