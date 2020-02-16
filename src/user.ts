import UserToken from "./userToken";
import db from './db';

export interface UserSchema {
    name: string,
    displayName: string
    email: string,
    userToken: UserToken | string,
    ownedChats: string[],
    memberChats: string[],
    followers: UserToken[]
}

export default class User {
    static users: User[] = [];

    userToken: UserToken;
    cipherPassword: string;

    public details: { // this information is publicly available
        email: string,
        displayName: string,
        followers: UserToken[],
    };

    constructor(token: UserToken) {
        this.userToken = token;
    }

    static loadUsers() {
        const userStore: UserSchema[] = db.loadUsers();

        for (const pseudoUser of userStore)
            User.users.push(User.construct(pseudoUser));
    }

    static resolveFromCredentials(email: string, clientSecret: string): User {
        this.loadUsers();

        for (const user of this.users)
            if (user.details.email === email)
                if (user.cipherPassword === clientSecret)
                    return user;

        return null;
    }

    static construct(pseudoUser: UserSchema): User {
        const {email, displayName, ownedChats, userToken, memberChats, followers} = pseudoUser;

        const user: User = new User(userToken instanceof UserToken ? userToken : new UserToken(userToken));

        for (const chat of memberChats)
            user.joinChat(chat);

        for (const chat of ownedChats)
            user.createChat(chat);

        user.details.email = email;
        user.details.displayName = displayName;
        user.details.followers = followers;

        return user;
    }

    joinChat(chatId: string) { // join chat will add user to member list

    }

    createChat(chatId: string) { // create chat will add user to owner list

    }

    matchId(foreignId: UserToken): boolean {
        return foreignId.matches(this.userToken);
    }

    saveUser() {
        db.saveUser(this);
    }
}
