import * as WebSocket from 'ws';
import * as http from 'http';

import parseRequest, {SocketResponse} from './parse';
import UserToken from "../userToken";
import ChatToken from "../chatToken";

import SocketManager from './socketManager';

export interface SocketMessage {
    initiator: UserToken
    target: ChatToken,
    request: string,
    data?: any
}

export enum status {
    rejected,
    failed,
    empty,
    newMessage,
    sendMessage,
}

export default function integrateClient(wss: WebSocket.Server) {
    const manager = new SocketManager(wss);

    wss.on('connection', function (socket: WebSocket, req: http.IncomingMessage) {
        console.log("Socket:", new Date().toLocaleString(), 'Connection established:', req.connection.remoteAddress);

        socket.on('message', function (data: string) {
            const message: {
                initiator: string,
                target: string,
                request: string,
                data?: string
            } = JSON.parse(data.toString());

            console.log("Socket:", new Date().toLocaleString(), message.request, 'by', message.initiator);

            if (message.initiator)
                socket.send(JSON.stringify(parseRequest.bind({manager, socket})({
                    initiator: new UserToken(message.initiator),
                    target: message.target ? new ChatToken(message.target) : null,
                    request: message.request,
                    data: message.data
                })));
            else
                socket.send(JSON.stringify((function (): SocketResponse {
                    return {
                        actionUser: null,
                        code: status.rejected,
                        target: undefined
                    }
                })()));
        });

        socket.on('disconnect', function () {
            // manager.disconnect(manager.userSocketMap);
            manager.disconnect(socket);
        });
    });
}