"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var userToken_1 = require("../userToken");
var router = express.Router();
router.get('/findChat', function (req, res) {
    var user = new userToken_1.default(req.cookies('token')).resolve();
    var friend = new userToken_1.default(req.query.user, true);
    console.log(user, friend);
});
exports.default = router;
//# sourceMappingURL=chats.js.map