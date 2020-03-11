import UserToken from "./userToken";
import db from './db';
import Chat from "./chat";
import hash from "./hash";
import ChatToken from "./chatToken";
import chatToken from "./chatToken";
import Key from "./key";

export enum ChatFilter {
    alphabetical,
    counterAlphabetical,
    mostRecentActivity,
    leastRecentActivity,
    newest,
    oldest
}

type Filter<T> = (i: T, j: T) => number;
type FilterFunction<T> = Record<ChatFilter, Filter<T>>;

export const ChatFilters: FilterFunction<Chat> = { // currently all are listed alphabetically
    [ChatFilter.alphabetical]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
    [ChatFilter.counterAlphabetical]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
    [ChatFilter.mostRecentActivity]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
    [ChatFilter.leastRecentActivity]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
    [ChatFilter.newest]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
    [ChatFilter.oldest]: (i: Chat, j: Chat) => i.name < j.name ? 1 : -1,
};

export enum ChatOwner {
    mine,
    notMine,
    both
}

export interface UserSchemaBase {
    displayName: string
    email: string,
    userToken: UserToken | string,
    ownedChats: chatToken[],
    memberChats: ChatToken[],
    following: UserToken[] | string[],
    clientSecret: string,
    publicToken: string,
    pictureId?: string
}

export interface UserSchema extends UserSchemaBase {
    following: UserToken[]
}

export default class User {
    static users: User[] = [];
    static filters = ChatFilters;
    static filterNames = ChatFilter;

    userToken: UserToken;
    cipherPassword: string;

    ownedChats: ChatToken[];
    memberChats: ChatToken[];

    passwordResetId?: {
        date: Date,
        key: Key
    };

    public details: { // this information is publicly available
        email: string,
        displayName: string,
        following: UserToken[],
        id: string,
        picture: string
    };

    constructor(token: UserToken) {
        this.userToken = token;

        this.details = {
            email: '',
            displayName: '',
            following: [],
            id: '',
            picture: null
        };

        this.ownedChats = [];
        this.memberChats = [];
    }

    static loadUsers(): User[] {
        const userStore: UserSchema[] = db.loadUsers();

        return User.users = userStore.map(i => {
            try {
                return User.construct(i);
            } catch (err) {
                console.error(err);
                return null;
            }
        }).filter(i => !!i);
    }

    static resolveFromCredentials(email: string, clientSecret?: string): User {
        User.loadUsers();

        for (const user of User.users)
            if (user.details.email === email)
                if (clientSecret && user.cipherPassword === clientSecret)
                    return user;
                else if (!clientSecret)
                    return user;

        return null;
    }

    static construct(pseudoUser: UserSchema): User {
        const {email, displayName, ownedChats, userToken, memberChats, following, clientSecret, publicToken} = pseudoUser;

        const user: User = new User(userToken instanceof UserToken ? userToken : new UserToken(userToken));

        // console.log(pseudoUser);

        for (const chat of memberChats)
            user.memberChats.push(chat instanceof ChatToken ? chat : new ChatToken(chat));

        for (const chat of ownedChats)
            user.ownedChats.push(chat instanceof ChatToken ? chat : new ChatToken(chat));

        user.details.email = email;
        user.details.displayName = displayName;

        user.details.following = following.map(i => i instanceof UserToken ? i : new UserToken(i, true)).filter(i => !!i.resolve());

        user.details.id = publicToken;
        user.cipherPassword = clientSecret;

        return user;
    }

    listChats(filter: ChatFilter, list: ChatOwner = ChatOwner.both): Chat[] {
        const sortChats = (): Chat[] => {
            const chats: ChatToken[] = (function (chats: { owned: ChatToken[], member: ChatToken[] }): ChatToken[] {
                if (list === ChatOwner.both)
                    return [...chats.owned, ...chats.member];
                else if (list === ChatOwner.mine)
                    return chats.owned;
                else if (list === ChatOwner.notMine)
                    return chats.member;
                else return [];
            })({owned: this.ownedChats, member: this.memberChats});

            return chats.map(i => i.resolve()).filter(i => !!i).sort(ChatFilters[filter]);
        };

        return sortChats();
    }

    matchPassword(rawPassword: string): boolean {
        const saltRounds = Number(this.cipherPassword.slice(0, 3));

        return hash(rawPassword, saltRounds) === this.cipherPassword;
    }

    joinChat(chatId: string) { // join chat will add user to member list

    }

    createChat(chatId: string) { // create chat will add user to owner list

    }

    matchId(foreignId: UserToken): boolean {
        return foreignId.matches(this.userToken);
    }

    export() {
        db.saveUser(this);
    }
}
