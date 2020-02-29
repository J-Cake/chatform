import * as fs from 'fs';
import * as path from 'path';

import User, {UserSchema, UserSchemaBase} from "./user";
import Chat, {ChatJSONLayout} from "./chat";
import UserLayout from "../public/src/API/UserLayout";

interface DB {
    loadUsers(): UserSchema[];

    loadChat(id: string): Chat;

    saveUser(user: User): void;

    updateDb(): void;

    findUser(name: string): UserLayout[];
}

function JSONStore(): DB { // Use this in case the SQL Database isn't available. This will generally be used in development mode to keep user information separate from testing data
    const storePath: string = path.join(process.cwd(), 'store');

    const userStore = path.join(storePath, 'users.json');

    const users: UserSchema[] = fs.existsSync(userStore) ? JSON.parse(fs.readFileSync(path.join(storePath, 'users.json'), 'utf8')) : [];
    const chatsDir: string = path.join(path.join(storePath), 'chats');
    const chats: string[] = fs.readdirSync(chatsDir);

    return {
        updateDb(): void {
            interface UserSchema2 extends UserSchemaBase {
                following: string[]
            }

            fs.writeFileSync(path.join(storePath, 'users.json'), JSON.stringify((function (): UserSchema2[] {
                return users.filter(i => !!i).map(i => ({
                    clientSecret: i.clientSecret,
                    displayName: i.displayName,
                    email: i.email,
                    following: i.following.filter(i => !!i).map(i => i.id),
                    memberChats: i.memberChats,
                    ownedChats: i.ownedChats,
                    publicToken: i.publicToken,
                    userToken: i.userToken
                }));
            })()), 'utf8');
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
            const userIndex = users.findIndex(i => user.userToken.matches(i.userToken));

            const userTemplate = {
                displayName: user.details.displayName,
                email: user.details.email,
                userToken: user.userToken.id,
                ownedChats: user.ownedChats.map(i => i.id),
                memberChats: user.memberChats.map(i => i.id),
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
        findUser(name: string): UserLayout[] {
            return undefined;
        },
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
