import UserToken from "./userToken";
import ChatToken from "./chatToken";

export enum ReadStatus {
    failed = -1,
    sending,
    sent,
    received,
    read
}

export interface MessageJSONStructure {
    content: number[],
    sender: string, // convert to id token after
    timestamp: number, // millisecond timestamp
    chatId: string,
    readStatus: {
        [id: string]: ReadStatus // gets evaluated to a number
    }
}

export default class Message {
    sender: UserToken;

    timeStamp: Date;

    chat: ChatToken;
    message: number[];

    readStatus: {
        user: UserToken,
        status: ReadStatus
    }[]; // it's an array because multiple people could have seen the message

    constructor(messageStructure: {
        content: number[],
        sender: UserToken,
        timestamp: Date,
        chatId: ChatToken,
        readStatus: {
            user: UserToken,
            status: ReadStatus
        }[]
    }) {
        this.sender = messageStructure.sender;
        this.message = messageStructure.content;
        this.timeStamp = new Date(messageStructure.timestamp);
        this.chat = messageStructure.chatId;
        this.readStatus = messageStructure.readStatus;
    }

    static construct(source: MessageJSONStructure): Message {

        return new Message({
            content: source.content,
            sender: new UserToken(source.sender),
            timestamp: new Date(source.timestamp),
            chatId: new ChatToken(source.chatId),
            readStatus: Object.keys(source.readStatus).map(i => ({
                user: new UserToken(i),
                status: source.readStatus[i]
            }))
        });
    }

    toJson(): MessageJSONStructure {

        const read: {
            [id: string]: ReadStatus
        } = {};

        for (const id of this.readStatus)
            read[id.user.id] = id.status;

        return {
            chatId: this.chat.id,
            content: this.message,
            readStatus: read,
            sender: this.sender.toString(),
            timestamp: this.timeStamp.getTime()
        }
    }
}
