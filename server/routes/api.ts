import * as express from 'express';

import privateRoutes from './private';
import db from "../db";
import userToken from "../userToken";
import UserToken from "../userToken";
import User from "../user";

interface UserLayout {
    userName: string,
    profPicUrl?: string,
    userId: string
}

const router: express.Router = express.Router();

router.use("/", privateRoutes);

router.get('/users', function (req: express.Request, res: express.Response) {
    const username = req.query.user;

    function similarity(query): number {
        let similarity: number = 0;

        for (const i in username)
            if (query[i] == username[i])
                similarity++;

        return similarity;
    }

    if (username)
        res.json({
            code: 0,
            message: db.findUser(username).sort((i: UserLayout, j: UserLayout) => similarity(i.userName) > similarity(j.userName) ? 1 : -1)
        });
    else
        res.json({code: 0, message: []});
});

router.get('/userInfo/:userId', function (req: express.Request, res: express.Response) {
    const user: userToken = new UserToken(req.params.userId, true);
    const userObject: User = user.resolve();

    if (userObject)
        res.json({
            code: 0,
            message: <UserLayout>{
                userName: userObject.details.displayName,
                userId: userObject.details.id,
                profPicUrl: `/api/image/${userObject.details.id}`
            }
        })
});

router.get('/image/:publicId', function (req: express.Request, res: express.Response) {
    const userToken: UserToken = new UserToken(req.params.publicId, true);

    const user: User = userToken.resolve();

    if (!!user) {
        if (user.details.picture) {
            res.status(200);
            res.header('content-type', 'image/png');

            const img = db.getImage(user.details.picture);

            if (img)
                res.end(db.getImage(user.details.picture));
            else
                res.end("null");
        } else
            res.end("null");
    } else {
        res.status(404);
        res.end({
            code: 10,
            message: "User doesn't exist"
        })
    }
});

export default router;