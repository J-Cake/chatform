import * as express from 'express';

import DB from '../db';
import User from '../user';
import UserToken from "../userToken";
import Chat, {ChatJSONLayout} from "../chat";
import ChatToken from "../chatToken";
import Key from "../key";

const router: express.Router = express.Router();

router.get('/findChat', function (req: express.Request, res: express.Response) {
    const userToken: UserToken = new UserToken(req.cookies.token);
    const user: User = userToken.resolve();

    function newChat(): Chat {
        return;
    }

    if (req.query.user) {
        const friend: UserToken = new UserToken(req.query.user, true);

        if (friend) {
            const publicOwner: UserToken = new UserToken(userToken.resolve().details.id, true); // get public token
            const chat: ChatToken = new ChatToken(DB.getChat({
                owner: publicOwner,
                memberList: [friend]
            }) || new Key().toString());

            const friendUser: User = friend.resolve();

            const userGroup = new Chat(publicOwner, chat);
            userGroup.name = friendUser.details.displayName || "";
            userGroup.members.push(friend);

            userGroup.export();

            if (!user.ownedChats.find(i => chat.matches(i))) {
                user.ownedChats.push(chat);
                user.export();
            }

            if (!friendUser.memberChats.find(i => chat.matches(i))) {
                friendUser.memberChats.push(ChatToken.parse(chat));
                friendUser.export();
            }

            DB.loadChats();

            res.json({
                code: 9,
                message: {
                    chatId: userGroup.chatToken.id,
                    chatName: userGroup.name || friendUser.details.displayName
                }
            });
        } else {
            res.status(404);
            res.json({
                code: 4,
                message: "Invalid User Token"
            });
        }
    } else {
        res.status(400);
        res.json({
            code: 8,
            message: "No User provided"
        })
    }
});

router.get('/:id', function (req: express.Request, res: express.Response) {
    const userToken: UserToken = new UserToken(req.cookies.token);
    const chatToken: ChatToken = new ChatToken(req.params.id);
    const chat: Chat = Chat.construct(chatToken.resolve() as unknown as ChatJSONLayout);

    const isAllowed: boolean = !chat?.members.find(i => userToken.matches(i.id)) || new UserToken(userToken.resolve()?.details.id, true).matches(chat.owner.id);

    if (chat) {
        if (isAllowed) {
            res.json({
                code: 10,
                message: {
                    chat: chat.toJson()
                }
            });
        } else {
            res.status(403);
            res.json({
                code: 4,
                message: "you are not a member"
            })
        }
    } else {
        res.status(404);
        res.json({
            code: 9,
            message: "That chat does not exist"
        });
    }

});

export default router;