import {SocketResponse} from "./chats";
import * as StateManager from "./state/stateManager";
import State from "./state/globState";

export default function ws(message: {
    target: string,
    request: string,
    data?: number[]
}): Promise<SocketResponse> {
    return new Promise(async function (resolve) {
        const onetimeListener = StateManager.on('messageReceived', function (state: State) {
            resolve(state.currentMessage);

            StateManager.off(onetimeListener);
        });

        const {socketSession, id} = StateManager.default();

        if (!socketSession)
            await new Promise(resolve => StateManager.on("websocketConnected", () => resolve()));

        socketSession.send(JSON.stringify({
            initiator: id,
            target: message.target,
            request: message.request,
            data: message.data
        }));
    });
}