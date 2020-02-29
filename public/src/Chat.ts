import ChatLayout from "./API/ChatLayout";
import User from "./User";
import MessageFetcher from "./API/MessageFetcher";
import {ChatJSONLayout} from "../../server/chat";
import http, {Result} from "./http";

export default class Chat {

    members: User[];
    messages: MessageFetcher;

    constructor(id: string) {

    }

    async fetch(): Promise<ChatLayout> {
        return {}
    }

    static async resolve(id: string): Promise<Chat> {
        const chat: ChatJSONLayout = await http<ChatJSONLayout>(`/api/chat/${id}`, Result.json) as ChatJSONLayout;


        return;
    }
}