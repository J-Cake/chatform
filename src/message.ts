import UserToken from "./userToken";

export enum ReadStatus {
    sending,
    sent,
    received,
    read
}

export interface MessageJSONStructure {
    content: string,
    sender: string, // convert to id token after
    timestamp: number, // millisecond timestamp
    chatId: string,
    readStatus: {
        id: ReadStatus // gets evaluated to a number
    }
}

export default class Message {
    sender: UserToken;

    timeStamp: Date;

    chat: string;
    message: string;

    readStatus: {
        user: UserToken,
        status: ReadStatus
    }[]; // it's an array because multiple people could have seen the message

    constructor(messageStructure: {
        content: string,
        sender: UserToken,
        timestamp: Date,
        chatId: string,
        readStatus: {
            user: UserToken,
            status: ReadStatus
        }[]
    }) {
        this.sender = messageStructure.sender;
        this.message = messageStructure.content;
        this.timeStamp = messageStructure.timestamp;
        this.chat = messageStructure.chatId;
        this.readStatus = messageStructure.readStatus;
    }

    static construct(source: MessageJSONStructure): Message {
        return new Message({
            content: source.content,
            sender: new UserToken(source.sender),
            timestamp: new Date(source.timestamp),
            chatId: source.chatId,
            readStatus: Object.keys(source.readStatus).map(i => ({
                user: new UserToken(i),
                status: source.readStatus[i]
            }))
        });
    }
}
