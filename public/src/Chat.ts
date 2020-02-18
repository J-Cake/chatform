import ChatLayout from "./API/ChatLayout";
import User from "./User";
import MessageFetcher from "./API/MessageFetcher";

export default class Chat {

    members: User[];
    messages: MessageFetcher;

    constructor(id: string) {

    }

    async fetch(): Promise<ChatLayout> {
        return {}
    }
}