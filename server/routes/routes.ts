import * as express from 'express';
import * as path from 'path';

import User from "../user";
import UserToken from "../userToken";
import hash from '../hash';
import Key from "../key";

import ui from './ui';
import Email, {Templates} from "../email";

const router: express.Router = express.Router();

router.use(ui);


if (process.env.environment === "production") {
    router.get('/src/src.js', function (req, res) {
        res.redirect('/src/src.min.js');
    });

    router.use('/src', express.static(path.join(process.cwd(), './dist/public/production')));
    router.use('/css', express.static(path.join(process.cwd(), './dist/public/css/production')));
} else {
    router.use("/src", express.static(path.join(process.cwd(), './dist/public/')));
    router.use("/css", express.static(path.join(process.cwd(), './public/css')));
}

router.use('/res/', express.static(path.join(process.cwd(), './public/res')));

router.get('/', function (req: express.Request, res: express.Response) {
    if (!req.cookies.token)
        res.redirect("/login");
    else
        res.redirect('/dash');
});

router.get('/dash', function (req: express.Request, res: express.Response) {
    if (UserToken.isValidUser(req.cookies.token)) {
        const user: User = UserToken.fetchUserById(req.cookies.token);

        res.clearCookie('authentication_error');
        res.render('dash', {
            userObject: user,
            environment: process.env.ENV === "development" ? 0 : 1,
            UserToken
        });
    } else {
        res.cookie("authentication_error", 1);
        res.redirect("/login");
    }
});

router.get('/login', function (req: express.Request, res: express.Response) {
    const errorMessages = {
        '1': "Your API Token has expired. Please log in again.",
        '2': "Your username and password don't match any records.",
        '3': "Your password is incorrect.",
        '4': "Email address is not registered."
    };

    const cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    const preloadValues = req.cookies.props && JSON.parse(req.cookies.props);

    res.clearCookie('authentication_error');

    res.render('login', {
        error: cookieMessage,
        preloadValues: preloadValues || {email: "", un: ""}
    });
});

router.post("/login", function (req: express.Request, res: express.Response) {
    const email = req.body.email,
        password = req.body.password;

    const user: User = User.resolveFromCredentials(email);

    if (user) {
        if (user.matchPassword(password)) {
            if (user) {
                res.cookie("token", user.userToken.id);
                res.redirect("/dash");
            } else {
                res.status(403);
                res.cookie('authentication_error', 2);
                res.cookie('props', JSON.stringify({
                    email: email
                }));
                res.redirect("/login");
            }
        } else {
            res.cookie("authentication_error", '3');
            res.cookie('props', JSON.stringify({
                email: email
            }));
            res.redirect('/login');
        }
    } else {
        res.cookie("authentication_error", '3');
        res.cookie('props', JSON.stringify({
            email: email
        }));
        res.redirect('/login');
    }
});

router.get('/signup', function (req: express.Request, res: express.Response) {
    const errorMessages = {
        '0': 'Success',
        '1': "Email is taken",
        '2': "Your passwords don't match",
        '3': 'Your username is taken',
        '4': 'Your username contains \'@\', \'$\', \'\\\' or whitespace'
    };

    const cookieMessage = errorMessages[req.cookies.authentication_error || '0'];
    const preloadValues = req.cookies.props && JSON.parse(req.cookies.props);

    if (req.cookies.authentication_error !== '0')
        res.status(403);

    res.clearCookie('authentication_error');

    res.render('signup', {
        error: cookieMessage,
        preloadValues: preloadValues || {email: "", un: ""}
    });
});

router.post("/signup", function (req: express.Request, res: express.Response) {
    const {email, username, password, 'password-confirm': passwordConfirm} = req.body;

    if (username.includes(/[@\s$\\]/)) {
        res.status(400);
        res.cookie('authentication_error', 4);
        res.redirect('/signup');
    } else {
        if (password === passwordConfirm) {
            const hashedPassword = hash(password, Math.floor(Math.random() * 10) + 5);

            const fetchUser = User.resolveFromCredentials(email, hashedPassword);

            if (fetchUser) { // user accidentally tried to sign up instead of logging in. No matter, redirect to the dash anyway
                res.cookie('token', fetchUser.userToken.id);
                res.clearCookie('authentication_error');
                res.redirect("/dash");
            } else {
                for (const user of User.users)
                    if (user.details.email === email) {
                        res.status(403);
                        res.cookie('authentication_error', 1);
                        res.redirect('/signup');
                        return;
                    }

                const user = new User(new UserToken(new Key().toString()));

                user.cipherPassword = hashedPassword;

                user.details.email = email;
                user.details.displayName = username;
                user.details.id = user.userToken.key.next().toString();
                user.export();

                if (user) {
                    res.cookie("token", user.userToken.id);
                    res.redirect("/dash");
                } else {
                    res.status(403);
                    res.cookie('authentication_error', 2);
                    res.cookie('props', JSON.stringify({
                        un: username,
                        email: email
                    }));
                    res.redirect("/signup");
                }
            }
        } else {
            res.status(403);
            res.cookie('authentication_error', 2);

            res.cookie('props', JSON.stringify({
                un: username,
                email: email
            }));

            res.redirect('/signup');
        }
    }
});

router.get('/forgot-password', function (req: express.Request, res: express.Response) {
    res.render('forgotPassword.ejs');
});

router.post("/reset-password", function (req: express.Request, res: express.Response) {
    const email = req.body.email;

    const user = User.resolveFromCredentials(email);

    if (user) {

        user.passwordResetId = {
            date: new Date(),
            key: new Key(32, (Math.random() * 256).toString())
        };

        const params = {
            username: user.details.displayName,
            email: user.details.email,
            resetKey: user.passwordResetId.key.toString()
        };

        user.export();

        const mail = new Email({
            recipient: user.details.email,
            subject: "Password Reset Request",
            body: Templates.passwordReset,
            params
        });

        mail.send().then(res => {
            console.log(res);
        });

        res.render("requestSent");
    } else {
        res.cookie('authentication_error', '4');
        res.redirect('/login');
    }
});

router.get('/reset-password/:keyId', function (req: express.Request, res: express.Response) {
    console.log(req.params.keyId);
});

export default router;
