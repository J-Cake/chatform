import navigate from './navigate';
import * as StateManager from "./state/stateManager";
import http, {Result} from "./http";

import dialogues from './dialogues';
import * as Friends from './friends';
import State from "./state/globState";

export interface Friend {
    userId: string,
    userName: string
}

window.addEventListener("load", async function () {
    const friends: Friend[] = await http<Friend[]>("/api/friends", Result.text) as Friend[];

    StateManager.dispatch("init", {
        friends
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
    })
});