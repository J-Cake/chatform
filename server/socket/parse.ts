import {SocketMessage} from "./integrate";
import UserToken from "../userToken";

import resolvers from './resolver';
import ChatToken from "../chatToken";

export enum status {
    registered,
    rejected,
    failed,
    empty,
    newMessage,
    sendMessage,
}

export interface SocketResponse {
    code: status,
    actionUser: UserToken,
    target: ChatToken
    data?: any,
}

export interface Resolver {
    [key: string]: (clientRequest: SocketMessage) => SocketResponse;
}

export default function parseRequest(clientRequest: SocketMessage): SocketResponse {
    const resolver: Resolver = {
        "send": resolvers.send,
        "register": resolvers.register
    };

    if (!!clientRequest.initiator.resolve())
        if (clientRequest.request in resolver)
            return resolver[clientRequest.request].bind(this)(clientRequest);
        else
            return {
                actionUser: clientRequest.initiator,
                code: status.rejected,
                target: null,
                data: "Unknown target"
            };
    else
        return {
            actionUser: null,
            code: status.rejected,
            target: null,
            data: "Request rejected: Invalid User Token"
        };
}