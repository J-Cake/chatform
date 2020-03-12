import * as $ from "jquery";

import navigate from './navigate';
import * as StateManager from "./state/stateManager";
import http, {Result} from "./http";

import dialogues from './dialogues';
import * as Friends from './friends';
import State from "./state/globState";

import {connect} from './chats';
import Chat from "./API/Chat";
import ws from "./ws";

export enum status {
    registered,
    rejected,
    failed,
    empty,
    newMessage,
    sendMessage,
}

export interface Friend {
    userId: string,
    userName: string
}

window.addEventListener("load", async function () {
    Friends.attachListeners($("#people-list .person"));

    const friends: Friend[] = (await http<{ code: number, message: Friend[] }>("/api/friend", Result.json) as { code: number, message: Friend[] }).message;
    console.log("friends connected", friends);

    connect();

    StateManager.dispatch("init", {
        friends,
        activeChatId: $("head meta[name='chatId']")?.attr('content')
    });

    document.querySelector("#befriend-btn").addEventListener("click", function () {
        dialogues.friendSearch.show();
    });

    window.addEventListener("hashchange", async function () {
        await navigate(window.location.hash);
    });

    StateManager.on('updateFriendList', function () {
        Friends.reloadFriends();
    });

    StateManager.on('openChat', function (state: State) {
        Friends.initChat(state.initUser);
    });

    StateManager.on('messageReceived', function (state: State) {
        console.log("Message Received", state.currentMessage);

        if (state.currentMessage.code === status.newMessage)
            state.activeChat.handleMessage(state.currentMessage);
    });

    StateManager.on('websocketConnected', async function (state: State) { // Initialisation. Connection has successfully been established and chatting can begin
        console.log("WebSocket Register Request Verified", await ws({
            target: null,
            request: 'register'
        }));

        if (state.activeChatId)
            StateManager.dispatch("fetchChat", prev => ({
                activeChat: new Chat(prev.activeChatId)
            }));

        const form = $("#message-composer");

        const value: string = (function (value: string | number | string[]): string {
            if (value instanceof Array)
                return value.join('');
            else if (typeof value === "string")
                return value;
            else if (typeof value === "number")
                return String(value);
        })(form.val());

        form.on('submit', function (e) {
            e.preventDefault();

            const box = $("#message-box");
            const cont = box.val();

            state.activeChat.sendMessage(String(cont));

            box.val('');

            return false;
        })
    });

    const msg = $("#messages");
    // msg.scrollTop(msg.height());
});