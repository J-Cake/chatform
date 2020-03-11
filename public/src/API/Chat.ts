import * as emojiUnicode from 'emoji-unicode';

import User from "../User";
import MessageFetcher from "./MessageFetcher";
import ChatLayout from "./ChatLayout";
import http, {Result} from "../http";
import MessageLayout from "./MessageLayout";
import escapeBehaviours from '../escapeBehaviour';
import ws from "../ws";

export default class Chat {

    id: string;

    members: User[];
    messages: MessageFetcher;

    constructor(id: string) {
        // TODO: Implement constructor
        this.id = id;

        this.open();
    }

    static async resolve(id: string): Promise<Chat> {
        const chat: ChatLayout = await http<ChatLayout>(`/api/chats/${id}`, Result.json) as ChatLayout;

        const chatObject = new Chat(id);

        return await chatObject.open(chat);
    }

    async open(template?: ChatLayout): Promise<Chat> {
        const chat: ChatLayout = (await http<{ code: number, message: { chat: ChatLayout } }>(`/api/chats/${this.id}`, Result.json) as { code: number, message: { chat: ChatLayout } }).message.chat;

        this.members = chat.members.map(i => new User((i as any).id.toString()));

        await Promise.all(this.members.map(i => i.open()));

        return this;
    }

    handleMessage(message: MessageLayout) {

    }

    async sendMessage(message: string): Promise<void> {
        const escaped: string = (function (message: string): string {
            const output: string[] = [];

            let i: number = 0;
            let isEscaped: boolean = false;

            for (i = 0; i < message.length; i++) {
                const escapeBehaviour: string | ((following: string) => string) = escapeBehaviours[message[i]];

                if (isEscaped) {
                    if (message[i] === "<" || message[i] === ">")
                        output.push(({
                            "<": "&lt;",
                            ">": "&gt;"
                        })[message[i]]);
                    else
                        output.push(message[i]);

                    isEscaped = false;
                } else if (!isEscaped && message[i] === "\\")
                    isEscaped = true;
                else if (message[i] in escapeBehaviours)
                    if (typeof escapeBehaviour === "string")
                        output.push(escapeBehaviour);
                    else
                        message = message.slice(i) + escapeBehaviour(message.slice(i));
                else
                    output.push(message[i]);
            }

            return output.join('');
        })(message);

        const charList: number[] = Array.from(escaped).map(i => emojiUnicode.raw(i));

        console.log(charList.map(i => String.fromCodePoint(i))); // Important: do not join the character list with an empty string as the commas are required to split it back into a sequence of characters.

        console.log(await ws({
            request: "send",
            target: this.id,
            data: charList
        }));
    }
}