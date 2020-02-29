"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var userToken_1 = require("../userToken");
var logger_1 = require("./logger");
var chats_1 = require("./chats");
var router = express.Router();
router.use("/chats", chats_1.default);
router.use(function (req, res, next) {
    if (!req.cookies.token)
        res.json({
            code: 2,
            message: "A valid token is required to access these functions"
        });
    else if (!new userToken_1.default(req.cookies.token).resolve())
        res.json({
            code: 3,
            message: "the provided access token is invalid"
        });
    else
        next();
});
router.get('/friend', function (req, res) {
    var user = userToken_1.default.fetchUserById(req.cookies.token);
    if (user)
        res.json({
            code: 0,
            message: user.details.following.map(function (i) { return ({ id: i.id, userName: i.resolve().details.displayName }); })
        });
    else {
        res.status(403);
        res.json({
            code: 1,
            message: "invalid token"
        });
    }
});
router.put('/friend', function (req, res) {
    var user = userToken_1.default.fetchUserById(req.cookies.token);
    var friend = new userToken_1.default(req.query.user, true);
    if (friend.matches(user.userToken))
        res.json({ code: 6, message: "you cannot befriend yourself" });
    else if (user)
        if (friend.resolve()) {
            try {
                if (!user.details.following.find(function (i) { return i.matches(friend); })) {
                    user.details.following.push(friend);
                    user.export();
                }
                else {
                    res.status(409);
                    res.json({ code: 4, message: "requested account already in friend list" });
                    return;
                }
            }
            catch (e) {
                logger_1.logger(e);
                res.status(500);
                res.json({ code: -1, message: "an internal error occurred and has been logged" });
                return;
            }
            res.json({ code: 0, message: "success" });
        }
        else {
            res.status(404);
            res.json({ code: 4, message: "requested person does not exist" });
        }
    else {
        res.status(403);
        res.json({ code: 1, message: "invalid token" });
    }
});
router.delete("/friend", function (req, res) {
    var user = userToken_1.default.fetchUserById(req.cookies.token);
    var friend = new userToken_1.default(req.query.user, true);
    if (user) {
        if (friend.resolve() && user.details.following.find(function (i) { return i.matches(friend); })) {
            user.details.following.splice(user.details.following.findIndex(function (i) { return i.matches(friend); }), 1);
            user.export();
        }
        else {
            res.status(404);
            res.json({ code: 4, message: "requested person does not exist or is not in your friend list" });
        }
    }
    else {
        res.status(403);
        res.json({ code: 1, message: "invalid token" });
    }
});
exports.default = router;
//# sourceMappingURL=private.js.map