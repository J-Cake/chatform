import * as stateManager from "./state/stateManager";
import {status} from "./index";

export interface SocketResponse {
    code: status,
    actionUser: { id: string, isPublicKey: true },
    target: { id: string },
    data?: any
}

export function openChat(id: string) {
    if (id)
        window.location.href = `/chat/${id}`;
}

export function connect() {
    stateManager.dispatch("connectAttempt", function (prev) {
        const ws = new WebSocket(prev.wsUrl);

        ws.addEventListener("open", () => stateManager.broadcast("websocketConnected"));
        ws.addEventListener("close", () => stateManager.broadcast("websocketDisconnected"));
        ws.addEventListener("error", () => stateManager.broadcast("websocketError"));
        ws.addEventListener("message", ({data}) => stateManager.dispatch("messageReceived", {
            currentMessage: JSON.parse(data) as SocketResponse
        }));

        return {
            socketSession: ws
        };
    });
}