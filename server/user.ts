import UserToken from "./userToken";
import db from './db';
import Chat from "./chat";
import hash from "./hash";

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

export const ChatFilters: FilterFunction<Chat> = {
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

export interface UserSchema {
    displayName: string
    email: string,
    userToken: UserToken | string,
    ownedChats: string[],
    memberChats: string[],
    following: UserToken[],
    clientSecret: string
}

export default class User {
    static users: User[] = [];
    static filters = ChatFilters;
    static filterNames = ChatFilter;

    userToken: UserToken;
    cipherPassword: string;

    ownedChats: Chat[];
    memberChats: Chat[];

    public details: { // this information is publicly available
        email: string,
        displayName: string,
        following: UserToken[],
    };

    constructor(token: UserToken) {
        this.userToken = token;

        this.details = {
            email: '',
            displayName: '',
            following: []
        };

        this.ownedChats = [];
        this.memberChats = [];
    }

    static loadUsers() {
        const userStore: UserSchema[] = db.loadUsers();

        const users: User[] = [];
        try {
            for (const pseudoUser of userStore)
                users.push(User.construct(pseudoUser));

        } catch (err) {
            return;
        } finally {
            User.users = users;
        }
    }

    static resolveFromCredentials(email: string, clientSecret?: string): User {
        if (User.users.length <= 0)
            this.loadUsers();

        for (const user of User.users)
            if (user.details.email === email)
                if (clientSecret && user.cipherPassword === clientSecret)
                    return user;
                else if (!clientSecret)
                    return user;

        return null;
    }

    static construct(pseudoUser: UserSchema): User {
        const {email, displayName, ownedChats, userToken, memberChats, following, clientSecret} = pseudoUser;

        const user: User = new User(userToken instanceof UserToken ? userToken : new UserToken(userToken));

        for (const chat of memberChats)
            user.joinChat(chat);

        for (const chat of ownedChats)
            user.createChat(chat);

        user.details.email = email;
        user.details.displayName = displayName;
        user.details.following = following;
        user.cipherPassword = clientSecret;

        return user;
    }

    listChats(filter: ChatFilter, list: ChatOwner = ChatOwner.both): Chat[] {
        if (list === ChatOwner.mine)
            return this.ownedChats.sort(ChatFilters[ChatFilter.alphabetical] as Filter<Chat>);
        else if (list === ChatOwner.notMine)
            return this.memberChats.sort(ChatFilters[filter]);
        else if (list === ChatOwner.both)
            return [...this.ownedChats, ...this.memberChats].sort(ChatFilters[filter]);
        else
            return [];
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
