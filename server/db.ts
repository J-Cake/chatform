import * as fs from 'fs';
import * as path from 'path';

import User, {UserSchema} from "./user";
import {ChatJSONLayout} from "./chat";
import UserToken from "./userToken";
import ChatToken from "./chatToken";

interface UserLayout {
    userName: string,
    profPicUrl?: string,
    userId: string
}

interface DB {
    loadUsers(): UserSchema[];

    loadChats(): ChatJSONLayout[];

    saveUser(user: User): void;

    updateDb(): void;

    findUser(name: string): UserLayout[];

    getChat(filter: { publicToken?: UserToken; chatId?: ChatToken, memberList: UserToken[] }): string;

    exportChat(chat: ChatJSONLayout): void;

    getImage(id: string): Buffer;
}

function JSONStore(): DB { // Use this in case the SQL Database isn't available. This will generally be used in development mode to keep user information separate from testing data
    const storePath: string = path.join(process.cwd(), 'store');
    if (!fs.existsSync(storePath))
        fs.mkdirSync(storePath);

    if (!fs.existsSync(path.join(storePath, 'images')))
        fs.mkdirSync(path.join(storePath, 'images'));

    if (!fs.existsSync(path.join(storePath, 'chats')))
        fs.mkdirSync(path.join(storePath, 'chats'));

    if (!fs.existsSync(path.join(storePath, 'users.json')))
        fs.writeFileSync(path.join(storePath, 'users.json'), JSON.stringify([]));

    const userStore = path.join(storePath, 'users.json');

    const loadUsers = function (): UserSchema[] {
        try {
            return JSON.parse(fs.readFileSync(userStore, 'utf8'));
        } catch (err) {
            return [];
        }
    };

    const users: UserSchema[] = (loadUsers)();

    const chatsDir: string = path.join(path.join(storePath), 'chats');
    const chats: string[] = fs.readdirSync(chatsDir);

    return {
        getImage(id: string): Buffer {
            const pth = path.join(storePath, 'images', id);

            if (fs.existsSync(pth))
                return fs.readFileSync(pth);
            else
                return null;
        },
        exportChat(chat: ChatJSONLayout): void {
            fs.writeFileSync(path.join(chatsDir, chat.chatId.id + '.json'), JSON.stringify(chat), 'utf8');
        },

        getChat(filter: { owner?: UserToken; chatId?: ChatToken, memberList?: UserToken[] }): string {
            const chats = JSONStore().loadChats();

            const _filter = {
                owner: filter.owner ? filter.owner.id : undefined,
                chatId: filter.chatId ? filter.chatId.id : undefined,
                members: filter.memberList instanceof Array ? filter.memberList.map(i => i.id) : undefined
            };

            const candidates: ChatJSONLayout[] = [];

            for (const chat of chats) {
                const _chat = {
                    chatId: chat.chatId.id,
                    owner: chat.owner.id,
                    members: chat.members.map(i => i.id)
                };

                if (_filter.chatId && (_chat.chatId !== _filter.chatId))
                    continue;
                if (_filter.owner && (_chat.owner !== _filter.owner))
                    continue;

                let skip = false;

                const memberList = [];

                for (const i of _chat.members)
                    if (_filter.members.includes(i))
                        memberList.push(i);
                    else {
                        skip = true;
                        break;
                    }

                if (!skip)
                    for (const member of _filter.members)
                        if (!memberList.includes(member)) {
                            skip = true;
                            break;
                        }

                if (!skip)
                    candidates.push(chat);
            }

            if (candidates[0])
                return candidates[0].chatId.id;
            else
                return null;
        },
        updateDb(): void {
            fs.writeFileSync(userStore, JSON.stringify(users.filter(i => !!i).map(i => ({
                clientSecret: i.clientSecret,
                displayName: i.displayName,
                email: i.email,
                following: i.following.filter(i => !!i).map(i => i.id),
                memberChats: i.memberChats.map(i => i.id),
                ownedChats: i.ownedChats.map(i => i.id),
                publicToken: i.publicToken,
                userToken: i.userToken
            }))), 'utf8');
        },
        loadUsers(): UserSchema[] {
            users.length = 0;
            const usrs = loadUsers();

            for (const user of usrs)
                users.push(user);

            return users;
        },
        loadChats(): ChatJSONLayout[] {
            const outputChats: ChatJSONLayout[] = [];

            for (const chatFile of chats)
                outputChats.push(JSON.parse(fs.readFileSync(path.join(chatsDir, chatFile), 'utf8')));

            return outputChats;
        },
        saveUser(user: User): void {
            const userIndex = users.findIndex(i => user.userToken.matches(i.userToken));

            const userTemplate = {
                displayName: user.details.displayName,
                email: user.details.email,
                userToken: user.userToken.id,
                ownedChats: user.ownedChats,
                memberChats: user.memberChats,
                following: user.details.following,
                clientSecret: user.cipherPassword,
                publicToken: user.details.id
            };

            if (userIndex === -1)
                users.push(userTemplate);
            else
                users[userIndex] = userTemplate;

            stores.json.updateDb();
        }, findUser(name: string): UserLayout[] {
            const searchName: string[] = name.toLowerCase().split(/\W+/g);
            const foundUsers: UserSchema[] = users.filter(function (i: UserSchema): boolean {
                const displayName = i.displayName.toLowerCase().split(/\W+/g);

                return searchName.map(function (i) {
                    return displayName.map(j => j.indexOf(i) > -1).includes(true)
                }).includes(true);
            });

            return foundUsers.map(function (i: UserSchema): UserLayout {
                return {
                    userName: i.displayName,
                    userId: i.publicToken
                }
            }) as UserLayout[];
        }
    };
}

function PostgresStore(): DB { // Use this in case the SQL Database is available.
    return {
        getImage(id: string): Buffer {
            return undefined;
        },
        exportChat(chat: ChatJSONLayout): void {
        }, // TODO: Implement
        loadChats(): ChatJSONLayout[] {
            return [];
        }, getChat(filter: { publicToken?: UserToken; chatId?: ChatToken; memberList: UserToken[] }): string {
            return;
        },
        findUser(name: string): UserLayout[] {
            return undefined;
        },
        updateDb(): void {
        }, // TODO: Implement method with postgres
        loadUsers(): UserSchema[] {
            return;
        },
        // loadChat(id: string): Chat {
        //     return;
        // },
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
