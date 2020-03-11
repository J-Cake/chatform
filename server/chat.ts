import UserToken from "./userToken";
import Message, {MessageJSONStructure} from "./message";
import Key from './key';
import db from "./db";
import ChatToken from "./chatToken";

export interface ChatJSONLayout {
    chatName: string,
    chatId: ChatToken,
    members: UserToken[],
    owner: UserToken,
    messages: MessageJSONStructure[]
}

export default class Chat {
    static chats: Chat[] = [];

    chatToken: ChatToken;

    name: string;
    members: UserToken[] = [];

    owner: UserToken;

    messages: Message[] = [];

    constructor(ownerId: UserToken, id?: string | ChatToken) {
        if (!!ownerId.resolve())
            this.owner = ownerId;
        else
            throw new TypeError("User Doesn't Exist");

        if (id instanceof ChatToken)
            this.chatToken = id;
        else if (id && id.length >= 16)
            this.chatToken = new ChatToken(id);
        else
            this.chatToken = new ChatToken(new Key().toString());
    }

    static resolve(id: string): Chat {
        return this.construct(db.loadChat(id));
    }

    static construct(chat: ChatJSONLayout): Chat {
        return new Chat(chat.owner instanceof UserToken ? chat.owner : new UserToken((chat.owner as any).id, true), chat.chatId instanceof ChatToken ? chat.chatId : new ChatToken((chat.chatId as any).id)).load(chat);
    }

    static convertToJsonFormat(chatRawObject: {
        chatName: string
        chatId: string | ChatToken,
        members: Array<string | UserToken>, // string[] | UserToken[] doesn't seem to be recognised by typescript as having the `map` property in common.
        owner: string | UserToken,
        messages: MessageJSONStructure[]
    }[]): ChatJSONLayout[] {
        return chatRawObject.map(i => ({
            chatName: i.chatName,
            chatId: i.chatId instanceof ChatToken ? i.chatId : new ChatToken(i.chatId),
            members: i.members.map(i => i instanceof UserToken ? i : new UserToken(i)),
            owner: i.owner instanceof UserToken ? i.owner : new UserToken(i.owner, true),
            messages: i.messages.map(i => Message.construct(i).toJson())
        }));
    }

    load(chat: ChatJSONLayout): Chat {
        this.name = chat.chatName;
        this.members = chat.members.map(i => i instanceof UserToken ? i : new UserToken((i as any).id)) || [];
        this.owner = chat.owner instanceof UserToken ? chat.owner : new UserToken((chat.owner as any).id, true);
        this.messages = chat.messages.map(i => Message.construct(i)) || [];

        return this;
    }

    matchId(foreignId: ChatToken): boolean {
        return foreignId.matches(this.chatToken);
    }

    toJson(): ChatJSONLayout {
        return {
            chatId: this.chatToken,
            chatName: this.name,
            members: this.members,
            messages: this.messages.map(i => i.toJson()),
            owner: this.owner
        };
    }

    export() {
        db.exportChat(this.toJson());
    }

    sendMessage(msg: Message): void {
        this.messages.push(msg);
        this.export();
    }
}
