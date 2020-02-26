import * as express from 'express';

import privateRoutes from './private';
import db from "../db";
import UserLayout from "../../public/src/API/UserLayout";

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

export default router;