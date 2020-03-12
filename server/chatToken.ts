import Key from "./key";
import Chat, {ChatJSONLayout} from "./chat";
import db from './db';

// const chatStore: ChatJSONLayout[] = db.loadChats();

export default class ChatToken {
    private static chatStore: ChatJSONLayout[] = db.loadChats();
    // private static chatStore: ChatJSONLayout[] = [];

    id: string;

    constructor(id: string) {
        if (id.length >= 16)
            this.id = id;
    }

    get key(): Key {
        return Key.fromKey(this.id);
    }

    static parse(id: ChatToken | { id: string } | string): ChatToken {
        if (id instanceof ChatToken)
            return id;
        else if (typeof id === "string")
            return new ChatToken(id);
        else
            return new ChatToken(id.id);
    }

    static isValidChat(id: ChatToken | string): boolean {
        const chatId: ChatToken = ChatToken.parse(id);

        return !!Chat.chats.find(i => i.matchId(chatId));
    }

    static fetchChatById(id: ChatToken | string): Chat {
        return ChatToken.parse(id).resolve();
    }

    matches(id: string | ChatToken | { id: string }): boolean {
        if (id)
            return (id instanceof ChatToken ? id.id : (typeof id === "string" ? id : id.id)) === this.id;
        else
            return false;
    }

    resolve(): Chat {
        for (const chat of Chat.chats) // should the user have already been constructed, there's no need to recreate it, hence return the already existing instance
            if (chat.matchId(this))
                return chat;

        return db.loadChats().find(i => this.matches(i.chatId)) || null;
    }

    toString(): string {
        return this.id;
    }

}