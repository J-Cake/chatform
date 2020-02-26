import http, {Result} from "./http";
import {Friend} from "./index";
import {ChatJSONLayout} from "../../server/chat";

export async function reloadFriends() {
    const friends: Friend[] = await http<Friend[]>('/api/friend', Result.json) as Friend[];

    console.log(friends); // TODO: Update Friends
}

export async function initChat(userId: string) {
    const chatLog: ChatJSONLayout = await http<ChatJSONLayout>(`/api/findChat?${userId}`, Result.json) as ChatJSONLayout;

    console.log(chatLog);
}