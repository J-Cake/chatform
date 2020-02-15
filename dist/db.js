"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var chat_1 = require("./chat");
function JSONStore() {
    var storePath = path.join(process.cwd(), 'store');
    var users = JSON.parse(fs.readFileSync(path.join(storePath, 'users.json'), 'utf8'));
    var chatsDir = path.join(path.join(storePath), 'chats');
    var chats = fs.readdirSync(chatsDir);
    return {
        loadUsers: function () {
            return users;
        },
        loadChat: function (id) {
            var chatsNames = chats.map(function (i) { return ({
                name: i,
                match: i.match(/^(.+)(?:\.json)$/)[0]
            }); });
            var index = chatsNames.map(function (i) { return i.match; }).indexOf(id);
            if (index >= 0) {
                var chat = JSON.parse(fs.readFileSync(path.join(chatsDir, chatsNames[index].name), "utf8"));
                return new chat_1.default(id).load(chat);
            }
        }
    };
}
function PostgresStore() {
    return {
        loadUsers: function () {
            return;
        },
        loadChat: function (id) {
            return;
        }
    };
}
var stores = {
    json: JSONStore(),
    postgres: PostgresStore()
};
exports.default = stores.json; // change this to the desired store
//# sourceMappingURL=db.js.map