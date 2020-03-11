import * as Cookie from 'js-cookie';

import Chat from "../API/Chat";
import {Friend} from '../index';
import {SocketResponse} from "../chats";

export default interface State {
    activeChat?: Chat,
    friends?: Friend[],
    initUser?: string,
    wsUrl?: string,
    socketSession?: WebSocket
    currentMessage?: SocketResponse,
    id?: string,
    activeChatId?: string
};

export const defaults: State = {
    wsUrl: `ws://${window.location.hostname}:${Number(window.location.port) + 1}/`,
    id: Cookie.get('token') || null,
    friends: []
};