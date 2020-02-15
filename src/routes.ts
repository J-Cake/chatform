import * as express from 'express';
import * as path from 'path';

import User from "./user";
import UserToken from "./userToken";
import hash from './hash';

const router: express.Router = express.Router();

router.use(express.static(path.join(process.cwd(), 'public')));

router.get('/', function (req: express.Request, res: express.Response) {
    if (!req.cookies.token)
        res.redirect("/login");
    else
        res.redirect('/dash');
});

router.get('/dash', function (req: express.Request, res: express.Response) {
    if (UserToken.isValidUser(req.cookies.token)) {
        res.clearCookie('authentication_error');
        res.render('dash');
    } else {
        res.cookie("authentication_error", 1);
        res.redirect("/login");
    }
});

router.get('/login', function (req: express.Request, res: express.Response) {
    const errorMessages = {
        '1': "Your API Token has expired. Please log out and back in again.",
        '2': "Your username and password don't match."
    };

    const cookieMessage = errorMessages[req.cookies.authentication_error || '0'];

    res.clearCookie('authentication_error');

    res.render('login', {
        error: cookieMessage
    });
});

router.post("/login", function (req: express.Request, res: express.Response) {
    const email = req.body.email,
        password = req.body.password;

    const hashedPassword = hash(password, Math.floor(Math.random() * 10) + 5);

    const user: User = User.resolveFromCredentials(email, hashedPassword);

    if (user)
        res.redirect("/dash");
    else {
        res.cookie('authentication_error', 2);
        res.redirect("/login");
    }
});

router.post("/signup", function (req: express.Request, res: express.Response) {
    const errorMessages = {
        '1': "Email is taken",
        '2': "Your passwords don't match",
        '3': 'Your username is taken'
    };

    const cookieMessage = errorMessages[req.cookies.authentication_error || '0'];

    res.render('/signup');
});

export default router;
