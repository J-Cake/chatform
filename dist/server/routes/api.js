"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var private_1 = require("./private");
var db_1 = require("../db");
var router = express.Router();
router.use("/", private_1.default);
router.get('/users', function (req, res) {
    var username = req.query.user;
    function similarity(query) {
        var similarity = 0;
        for (var i in username)
            if (query[i] == username[i])
                similarity++;
        return similarity;
    }
    if (username)
        res.json({
            code: 0,
            message: db_1.default.findUser(username).sort(function (i, j) { return similarity(i.userName) > similarity(j.userName) ? 1 : -1; })
        });
    else
        res.json({ code: 0, message: [] });
});
exports.default = router;
//# sourceMappingURL=api.js.map