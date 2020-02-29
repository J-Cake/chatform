"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userToken_1 = require("./userToken");
var ReadStatus;
(function (ReadStatus) {
    ReadStatus[ReadStatus["sending"] = 0] = "sending";
    ReadStatus[ReadStatus["sent"] = 1] = "sent";
    ReadStatus[ReadStatus["received"] = 2] = "received";
    ReadStatus[ReadStatus["read"] = 3] = "read";
})(ReadStatus = exports.ReadStatus || (exports.ReadStatus = {}));
var Message = /** @class */ (function () {
    function Message(messageStructure) {
        this.sender = messageStructure.sender;
        this.message = messageStructure.content;
        this.timeStamp = messageStructure.timestamp;
        this.chat = messageStructure.chatId;
        this.readStatus = messageStructure.readStatus;
    }
    Message.construct = function (source) {
        return new Message({
            content: source.content,
            sender: new userToken_1.default(source.sender),
            timestamp: new Date(source.timestamp),
            chatId: source.chatId,
            readStatus: Object.keys(source.readStatus).map(function (i) { return ({
                user: new userToken_1.default(i),
                status: source.readStatus[i]
            }); })
        });
    };
    return Message;
}());
exports.default = Message;
//# sourceMappingURL=message.js.map