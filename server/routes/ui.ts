import * as express from 'express';
import UserToken from "../userToken";
import User from "../user";
import ChatToken from "../chatToken";
import Chat, {ChatJSONLayout} from "../chat";

const router: express.Router = express.Router();

router.get('/chat/:chatId', function (req: express.Request, res: express.Response) {
    if (UserToken.isValidUser(req.cookies.token)) {
        const user: User = new UserToken(req.cookies.token).resolve();
        const chat: Chat = (function (chat: Chat | ChatJSONLayout): Chat {
            if (chat instanceof Chat)
                return chat;
            else
                return Chat.construct(chat);
        })(new ChatToken(req.params.chatId).resolve());

        if (chat) {
            res.clearCookie('authentication_error');
            res.render('dash', {
                userObject: user,
                chat,
                environment: process.env.ENV === "development" ? 0 : 1,
                UserToken
            });
        } else
            res.redirect('/dash');
    } else {
        res.cookie("authentication_error", 1);
        res.redirect("/login");
    }
});

export default router;