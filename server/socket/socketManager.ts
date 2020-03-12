import * as WebSocket from 'ws';
import ChatToken from "../chatToken";
import {SocketMessage} from "./integrate";
import UserToken from "../userToken";
import userToken from "../userToken";
import {SocketResponse, status} from "./parse";

export default class SocketManager {

    userSocketMap: {
        [userId: string]: [WebSocket]
    };

    server: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.server = wss;

        this.userSocketMap = {};
    }

    connect(id: string, socket: WebSocket): void {
        if (this.userSocketMap[id] instanceof Array)
            this.userSocketMap[id].push(socket);
        else
            this.userSocketMap[id] = [socket];

        console.log('Socket:', new Date().toLocaleString(), 'Client successfully connected');
    }

    disconnect(socket: WebSocket): void {
        let clients: { id: string, index: number }[] = [];

        for (const a in this.userSocketMap) {
            const clientList: WebSocket[] = this.userSocketMap[a];

            const clientIndex = clientList.findIndex(i => i === socket);
            if (clientIndex > -1)
                clients.push({
                    id: a,
                    index: clientIndex
                });
        }

        for (const i of clients)
            this.userSocketMap[UserToken.parse(i).toString()].splice(i.index, 1);

        console.log('Socket:', new Date().toLocaleString(), 'Client disconnected');
    }

    broadcastToMembers(chatId: ChatToken, message: SocketMessage): void { // TODO: Once a message is received, the client who receives it will receive a socket response from the original sender, exposing their private key
        try {
            const chat = chatId.resolve();

            if (chat) {
                const users: UserToken[] = chat.members;

                if (!users.find(i => UserToken.parse(chat.owner, true).matches(userToken.parse(i, true).id)))
                    users.push(chat.owner);

                // const senderIndex = users.findIndex(i => UserToken.parse(i).matches(UserToken.parse(message.initiator)));
                // if (senderIndex > -1)
                //     users.splice(senderIndex, 1);

                for (const user of users) {
                    const privateToken: UserToken = UserToken.parse(user, true);

                    this.return(UserToken.parse(privateToken.resolve().userToken, false).toString(), {
                        actionUser: message.initiator,
                        code: status.newMessage,
                        target: message.target,
                        data: message.data
                    });
                }
            } else {
                this.return(new UserToken(message.initiator.resolve().userToken).toString(), {
                    actionUser: message.initiator,
                    code: status.rejected,
                    target: message.target,
                    data: "The Chat doesn't exist"
                });
            }
        } catch (err) {
            console.error(err);
            this.return(new UserToken(message.initiator.resolve().userToken).toString(), {
                actionUser: message.initiator,
                code: status.failed,
                target: message.target
            });
        }
    }

    send(id: string, message: SocketMessage): void {
        const clients = this.userSocketMap[id];

        if (clients)
            for (const client of clients)
                client.send(JSON.stringify(message));
        else
            return null;
    }

    return(id: string, message: SocketResponse): void {
        const clients = this.userSocketMap[id];

        if (clients)
            for (const client of clients)
                client.send(JSON.stringify(message));
        else
            return null;
    }
}