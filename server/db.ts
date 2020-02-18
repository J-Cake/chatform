import * as fs from 'fs';
import * as path from 'path';

import User, {UserSchema} from "./user";
import Chat, {ChatJSONLayout} from "./chat";

interface DB {
    loadUsers(): UserSchema[];

    loadChat(id: string): Chat;

    saveUser(user: User): void;

    updateDb(): void;
}

function JSONStore(): DB { // Use this in case the SQL Database isn't available.
    const storePath: string = path.join(process.cwd(), 'store');
    const users: UserSchema[] = JSON.parse(fs.readFileSync(path.join(storePath, 'users.json'), 'utf8'));
    const chatsDir: string = path.join(path.join(storePath), 'chats');
    const chats: string[] = fs.readdirSync(chatsDir);

    return {
        updateDb(): void {
            fs.writeFileSync(path.join(storePath, 'users.json'), JSON.stringify(users), 'utf8');
        },
        loadUsers(): UserSchema[] {
            return users;
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
        },
        saveUser(user: User): void {
            users.push({
                displayName: user.details.displayName,
                email: user.details.email,
                userToken: user.userToken.id,
                ownedChats: user.ownedChats.map(i => i.id),
                memberChats: user.memberChats.map(i => i.id),
                following: user.details.following,
                clientSecret: user.cipherPassword
            });
            stores.json.updateDb();
        }
    };
}

function PostgresStore(): DB { // Use this in case the SQL Database is available.
    return {
        updateDb(): void {
        }, // TODO: Implement method with postgres
        loadUsers(): UserSchema[] {
            return;
        },
        loadChat(id: string): Chat {
            return;
        },
        saveUser(user: User): void {
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
