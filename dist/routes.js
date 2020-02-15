"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var user_1 = require("./user");
var userToken_1 = require("./userToken");
var hash_1 = require("./hash");
var router = express.Router();
router.use(express.static(path.join(process.cwd(), 'public')));
router.get('/', function (req, res) {
    if (!req.cookies.token)
        res.redirect("/login");
    else
        res.redirect('/dash');
});
router.get('/dash', function (req, res) {
    if (userToken_1.default.isValidUser(req.cookies.token)) {
        res.clearCookie('authentication_error');
        res.render('dash');
    }
    else {
        res.cookie("authentication_error", 1);
        res.redirect("/login");
    }
});
router.get('/login', function (req, res) {
    var errorMessages = {
        '1': "Your API Token has expired. Please log out and back in again.",
        '2': "Your username and password don't match."
    };
    var cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    res.clearCookie('authentication_error');
    res.render('login', {
        error: cookieMessage
    });
});
router.post("/login", function (req, res) {
    var email = req.body.email, password = req.body.password;
    var hashedPassword = hash_1.default(password, Math.floor(Math.random() * 10) + 5);
    var user = user_1.default.resolveFromCredentials(email, hashedPassword);
    if (user)
        res.redirect("/dash");
    else {
        res.cookie('authentication_error', 2);
        res.redirect("/login");
    }
});
router.get('/signup', function (req, res) {
    var errorMessages = {
        '1': ""
    };
    var cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    res.clearCookie('authentication_error');
    res.render('signup', {
        error: cookieMessage
    });
});
router.post("/signup", function (req, res) {
    var errorMessages = {
        '1': "Email is taken",
        '2': "Your passwords don't match",
        '3': 'Your username is taken'
    };
    var cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    res.render('/signup');
});
exports.default = router;
//# sourceMappingURL=routes.js.map