import * as $ from "jquery";

import http, {Result} from "./http";
import {Friend} from "./index";
import ChatLayout from "./API/ChatLayout";
import {openChat} from "./chats";

export async function reloadFriends() {
    const friends: Friend[] = await http<Friend[]>('/api/friend', Result.json) as Friend[];

    console.log(friends); // TODO: Update Friends
}

export async function initChat(userId: string) {
    const chatLog: ChatLayout = (await http<{ code: number, message: ChatLayout }>(`/api/chats/findChat?user=${userId}`, Result.json) as { code: number, message: ChatLayout }).message;

    openChat(chatLog.id);
}

export function attachListeners(friends: JQuery<HTMLElement>) {
    friends.click(async function () {
        const id: string | null = $(this).data('id') || null;

        if (id)
            await initChat(id);
        else
            this.remove();
    });
}