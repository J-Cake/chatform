import * as WebSocket from 'ws';
import ChatToken from "../chatToken";
import {SocketMessage} from "./integrate";
import UserToken from "../userToken";
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
            this.userSocketMap[i.id].splice(i.index, 1);

        console.log('Socket:', new Date().toLocaleString(), 'Client disconnected');
    }

    broadcastToMembers(chatId: ChatToken, message: SocketMessage): void {
        try {
            const chat = chatId.resolve();

            if (chat) {
                const users: UserToken[] = chat.members;

                if (!users.find(i => i.matches(chat.owner)))
                    users.push(chat.owner);

                const senderIndex = users.findIndex(i => i.matches(message.initiator));
                if (senderIndex > -1)
                    users.splice(senderIndex, 1);

                for (const user of users) {
                    console.log(user.id, message);
                    this.send(user.id, message);
                }
            }
        } catch (err) {
            this.return(message.initiator.toString(), {
                actionUser: message.initiator,
                code: status.failed,
                target: message.target
            });
        }
    }

    send(id: string, message: SocketMessage): void {
        if (id in this.userSocketMap)
            this.userSocketMap[id].forEach(i => i.send(JSON.stringify(message)));
        else
            return null;
    }

    return(id: string, message: SocketResponse): void {
        if (id in this.userSocketMap)
            this.userSocketMap[id].forEach(i => i.send(JSON.stringify(message)));
        else
            return null;
    }
}