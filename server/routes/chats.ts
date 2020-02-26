import * as express from 'express';

import User from '../user';
import UserToken from "../userToken";

const router: express.Router = express.Router();

router.get('/findChat', function (req: express.Request, res: express.Response) {
    const user: User = new UserToken(req.cookies('token')).resolve();
    const friend: UserToken = new UserToken(req.query.user, true);

    console.log(user, friend);
});

export default router;