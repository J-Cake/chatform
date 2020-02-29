"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modal_1 = require("./modal");
var findUser_1 = require("./findUser");
var dialogues = {
    friendSearch: new modal_1.default("Search For Friends", "<div class=\"friend\">\n    <input type=\"text\" name=\"username\" placeholder=\"User Name\" id=\"username-search\"/>\n    <div class=\"people\">\n        <span>Enter a user name</span>\n    </div>\n</div>").init(findUser_1.default)
};
exports.default = dialogues;
//# sourceMappingURL=dialogues.js.map