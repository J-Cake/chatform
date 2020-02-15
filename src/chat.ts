import UserToken from "./userToken";
import Message, {MessageJSONStructure} from "./message";
import Key from './key';
import db from "./db";

export interface ChatJSONLayout {
    chatName: string,
    chatId: string,
    members: string[],
    owner: UserToken,
    messages: MessageJSONStructure[]
}

export default class Chat {
    id: string;

    name: string;
    members: UserToken[];

    owner: UserToken;

    messages: Message[];

    constructor(id?: string) {
        if (id && id.length >= 16)
            this.id = id;
        else
            this.id = new Key().toString();
    }

    static resolve(id: string): Chat {
        return db.loadChat(id);
    }

    load(chat: ChatJSONLayout): Chat {
        this.name = chat.chatName;
        this.members = chat.members.map(i => new UserToken(i));
        this.owner = chat.owner;
        this.messages = chat.messages.map(i => Message.construct(i));

        return this;
    }
}
