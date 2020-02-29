"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var chat_1 = require("./chat");
function JSONStore() {
    var storePath = path.join(process.cwd(), 'store');
    var users = JSON.parse(fs.readFileSync(path.join(storePath, 'users.json'), 'utf8') || "[]");
    var chatsDir = path.join(path.join(storePath), 'chats');
    var chats = fs.readdirSync(chatsDir);
    return {
        updateDb: function () {
            fs.writeFileSync(path.join(storePath, 'users.json'), JSON.stringify((function () {
                return users.filter(function (i) { return !!i; }).map(function (i) { return ({
                    clientSecret: i.clientSecret,
                    displayName: i.displayName,
                    email: i.email,
                    following: i.following.filter(function (i) { return !!i; }).map(function (i) { return i.id; }),
                    memberChats: i.memberChats,
                    ownedChats: i.ownedChats,
                    publicToken: i.publicToken,
                    userToken: i.userToken
                }); });
            })()), 'utf8');
        },
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
        },
        saveUser: function (user) {
            var userIndex = users.findIndex(function (i) { return user.userToken.matches(i.userToken); });
            var userTemplate = {
                displayName: user.details.displayName,
                email: user.details.email,
                userToken: user.userToken.id,
                ownedChats: user.ownedChats.map(function (i) { return i.id; }),
                memberChats: user.memberChats.map(function (i) { return i.id; }),
                following: user.details.following,
                clientSecret: user.cipherPassword,
                publicToken: user.details.id
            };
            if (userIndex === -1)
                users.push(userTemplate);
            else
                users[userIndex] = userTemplate;
            stores.json.updateDb();
        }, findUser: function (name) {
            var searchName = name.toLowerCase().split(/\W+/g);
            var foundUsers = users.filter(function (i) {
                var displayName = i.displayName.toLowerCase().split(/\W+/g);
                return searchName.map(function (i) {
                    return displayName.map(function (j) { return j.indexOf(i) > -1; }).includes(true);
                }).includes(true);
            });
            return foundUsers.map(function (i) {
                return {
                    userName: i.displayName,
                    userId: i.publicToken
                };
            });
        }
    };
}
function PostgresStore() {
    return {
        findUser: function (name) {
            return undefined;
        },
        updateDb: function () {
        },
        loadUsers: function () {
            return;
        },
        loadChat: function (id) {
            return;
        },
        saveUser: function (user) {
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