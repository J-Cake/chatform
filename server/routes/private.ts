import * as express from 'express';
import UserToken from "../userToken";
import {logger} from "./logger";
import User from "../user";
import chat from "./chats";

const router: express.Router = express.Router();

router.use("/chats", chat);

router.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.cookies.token)
        res.json({
            code: 2,
            message: "A valid token is required to access these functions"
        });
    else if (!new UserToken(req.cookies.token).resolve())
        res.json({
            code: 3,
            message: "the provided access token is invalid"
        });
    else
        next();
});

router.get('/friend', function (req: express.Request, res: express.Response) { // Get all of your friends
    const user = UserToken.fetchUserById(req.cookies.token);

    if (user)
        res.json({
            code: 0,
            message: user.details.following.map(i => ({id: i.id, userName: i.resolve().details.displayName}))
        });
    else {
        res.status(403);
        res.json({
            code: 1,
            message: "invalid token"
        });
    }
});

router.put('/friend', function (req: express.Request, res: express.Response) { // Befriend someone
    const user = UserToken.fetchUserById(req.cookies.token);
    const friend = new UserToken(req.query.user, true);

    if (friend.matches(user.userToken))
        res.json({code: 6, message: "you cannot befriend yourself"});
    else if (user)
        if (friend.resolve()) {
            try {
                if (!user.details.following.find(i => i.matches(friend))) {
                    user.details.following.push(friend);
                    user.export();
                } else {
                    res.status(409);
                    res.json({code: 4, message: "requested account already in friend list"});
                    return;
                }
            } catch (e) {
                logger(e);
                res.status(500);
                res.json({code: -1, message: "an internal error occurred and has been logged"});
                return;
            }

            res.json({code: 0, message: "success"});
        } else {
            res.status(404);
            res.json({code: 4, message: "requested person does not exist"});
        }
    else {
        res.status(403);
        res.json({code: 1, message: "invalid token"});
    }
});

router.delete("/friend", function (req: express.Request, res: express.Response) { // drop friendship with someone
    const user: User = UserToken.fetchUserById(req.cookies.token);
    const friend: UserToken = new UserToken(req.query.user, true);

    if (user) {
        if (friend.resolve() && user.details.following.find(i => i.matches(friend))) {
            user.details.following.splice(user.details.following.findIndex(i => i.matches(friend)), 1);
            user.export();
        } else {
            res.status(404);
            res.json({code: 4, message: "requested person does not exist or is not in your friend list"});
        }
    } else {
        res.status(403);
        res.json({code: 1, message: "invalid token"});
    }
});

export default router;