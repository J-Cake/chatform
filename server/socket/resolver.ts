import {Resolver, SocketResponse, status} from "./parse";
import {SocketMessage} from "./integrate";
import Message from "../message";
import Chat, {ChatJSONLayout} from "../chat";
import UserToken from "../userToken";

const resolvers: Resolver = {
    send(clientRequest: SocketMessage): SocketResponse {
        // Log the message into the correct database, distribute the message to each member and return success message
        const chat: Chat = Chat.construct(clientRequest.target.resolve() as any as ChatJSONLayout);

        console.log("initiator", clientRequest.initiator);

        if (chat && chat instanceof Chat) {
            if (clientRequest.data) {
                // 1) Get Public key from initiator
                const publicKey: UserToken = new UserToken(clientRequest.initiator.resolve().details.id, true);
                // 2) Log The Message.
                chat.sendMessage(new Message({
                    chatId: chat.chatToken,
                    readStatus: [],
                    sender: publicKey,
                    timestamp: new Date(),
                    content: clientRequest.data
                }));
                // 3) Distribute The Message
                this.manager.broadcastToMembers(chat.chatToken, clientRequest);
                // 4) Return Success Message
                return {
                    actionUser: clientRequest.initiator,
                    code: status.sendMessage,
                    target: clientRequest.target
                }
            } else
                return {
                    actionUser: clientRequest.initiator,
                    code: status.empty,
                    target: clientRequest.target,
                }
        } else
            return {
                actionUser: clientRequest.initiator,
                code: status.failed,
                target: null,
                data: "Invalid target"
            };
    },
    receive(clientRequest: SocketMessage): SocketResponse {
        return;
    },
    register(clientRequest: SocketMessage): SocketResponse {
        if (clientRequest.initiator.resolve())

            this.manager.connect(clientRequest.initiator.toString(), this.socket);

        return {
            actionUser: clientRequest.initiator,
            code: status.registered,
            target: null
        };
    }
};

export default resolvers;