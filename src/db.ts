import * as fs from 'fs';
import * as path from 'path';

import {UserSchema} from "./user";
import Chat, {ChatJSONLayout} from "./chat";

interface DB {
    loadUsers(): UserSchema[],

    loadChat(id: string): Chat
}

function JSONStore(): DB { // Use this in case the SQL Database isn't available.
    const storePath = path.join(process.cwd(), 'store');
    const users = JSON.parse(fs.readFileSync(path.join(storePath, 'users.json'), 'utf8'));
    const chatsDir = path.join(path.join(storePath), 'chats');
    const chats = fs.readdirSync(chatsDir);

    return {
        loadUsers(): UserSchema[] {
            return users as UserSchema[]
        },
        loadChat(id: string): Chat {
            const chatsNames = chats.map(i => ({
                name: i,
                match: i.match(/^(.+)(?:\.json)$/)[0]
            }));
            const index = chatsNames.map(i => i.match).indexOf(id);

            if (index >= 0) {
                const chat: ChatJSONLayout = JSON.parse(fs.readFileSync(path.join(chatsDir, chatsNames[index].name), "utf8"));

                return new Chat(id).load(chat);
            }
        }
    };
}

function PostgresStore(): DB { // Use this in case the SQL Database is available.
    return { // TODO: Implement method with postgres
        loadUsers(): UserSchema[] {
            return;
        },
        loadChat(id: string): Chat {
            return;
        }
    }
}

const stores: {
    [key: string]: DB
} = {
    json: JSONStore(),
    postgres: PostgresStore()
};

export default stores.json; // change this to the desired store
