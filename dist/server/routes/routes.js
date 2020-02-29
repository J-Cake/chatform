"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var user_1 = require("../user");
var userToken_1 = require("../userToken");
var hash_1 = require("../hash");
var key_1 = require("../key");
var router = express.Router();
if (process.env.environment === "production") {
    router.get('/src/src.js', function (req, res) {
        res.redirect('/src/src.min.js');
    });
    router.use('/src', express.static(path.join(process.cwd(), './dist/public/production')));
    router.use('/css', express.static(path.join(process.cwd(), './dist/public/css/production')));
}
else {
    router.use("/src", express.static(path.join(process.cwd(), './dist/public')));
    router.use("/css", express.static(path.join(process.cwd(), './dist/public/css')));
}
router.get('/', function (req, res) {
    if (!req.cookies.token)
        res.redirect("/login");
    else
        res.redirect('/dash');
});
router.get('/dash', function (req, res) {
    if (userToken_1.default.isValidUser(req.cookies.token)) {
        var user = userToken_1.default.fetchUserById(req.cookies.token);
        console.log("User", user);
        res.clearCookie('authentication_error');
        res.render('dash', {
            userObject: user
        });
    }
    else {
        res.cookie("authentication_error", 1);
        res.redirect("/login");
    }
});
router.get('/login', function (req, res) {
    var errorMessages = {
        '1': "Your API Token has expired. Please log in again.",
        '2': "Your username and password don't match any records.",
        '3': "Your password is incorrect"
    };
    var cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    var preloadValues = req.cookies.props && JSON.parse(req.cookies.props);
    res.clearCookie('authentication_error');
    res.render('login', {
        error: cookieMessage,
        preloadValues: preloadValues || { email: "", un: "" }
    });
});
router.post("/login", function (req, res) {
    var email = req.body.email, password = req.body.password;
    var user = user_1.default.resolveFromCredentials(email);
    if (user) {
        if (user.matchPassword(password)) {
            if (user) {
                res.cookie("token", user.userToken.id);
                res.redirect("/dash");
            }
            else {
                res.status(403);
                res.cookie('authentication_error', 2);
                res.cookie('props', JSON.stringify({
                    email: email
                }));
                res.redirect("/login");
            }
        }
        else {
            res.cookie("authentication_error", '3');
            res.cookie('props', JSON.stringify({
                email: email
            }));
            res.redirect('/login');
        }
    }
    else {
        res.cookie("authentication_error", '3');
        res.cookie('props', JSON.stringify({
            email: email
        }));
        res.redirect('/login');
    }
});
router.get('/signup', function (req, res) {
    var errorMessages = {
        '0': 'Success',
        '1': "Email is taken",
        '2': "Your passwords don't match",
        '3': 'Your username is taken'
    };
    var cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    var preloadValues = req.cookies.props && JSON.parse(req.cookies.props);
    if (req.cookies.authentication_error !== '0')
        res.status(403);
    res.clearCookie('authentication_error');
    res.render('signup', {
        error: cookieMessage,
        preloadValues: preloadValues || { email: "", un: "" }
    });
});
router.post("/signup", function (req, res) {
    var _a = req.body, email = _a.email, username = _a.username, password = _a.password, passwordConfirm = _a["password-confirm"];
    if (password === passwordConfirm) {
        var hashedPassword = hash_1.default(password, Math.floor(Math.random() * 10) + 5);
        var fetchUser = user_1.default.resolveFromCredentials(email, hashedPassword);
        if (fetchUser) { // user accidentally tried to sign up instead of logging in. No matter, redirect to the dash anyway
            res.cookie('token', fetchUser.userToken.id);
            res.clearCookie('authentication_error');
            res.redirect("/dash");
        }
        else {
            for (var _i = 0, _b = user_1.default.users; _i < _b.length; _i++) {
                var user_2 = _b[_i];
                if (user_2.details.email === email) {
                    res.status(403);
                    res.cookie('authentication_error', 1);
                    res.redirect('/signup');
                    return;
                }
            }
            var user = new user_1.default(new userToken_1.default(new key_1.default().toString()));
            user.cipherPassword = hashedPassword;
            user.details.email = email;
            user.details.displayName = username;
            user.details.id = user.userToken.key.next().toString();
            user.export();
            if (user) {
                res.cookie("token", user.userToken.id);
                res.redirect("/dash");
            }
            else {
                res.status(403);
                res.cookie('authentication_error', 2);
                res.cookie('props', JSON.stringify({
                    un: username,
                    email: email
                }));
                res.redirect("/signup");
            }
        }
    }
    else {
        res.status(403);
        res.cookie('authentication_error', 2);
        res.cookie('props', JSON.stringify({
            un: username,
            email: email
        }));
        res.redirect('/signup');
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map