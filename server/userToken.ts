import User, {UserSchema} from "./user";
import db from './db';
import Key from "./key";

const userStore: UserSchema[] = db.loadUsers();

export default class UserToken { // the class used to represent a user rather than passing a user reference around everywhere
    id: string;
    isPublicKey: boolean;

    constructor(id: string | { id: string }, isPublicKey: boolean = false) {
        const _id = typeof id === "string" ? id : ("id" in id ? (id as any).id : id);
        if (_id.length >= 16)
            this.id = _id;

        this.isPublicKey = isPublicKey;
    }

    get key(): Key {
        return Key.fromKey(this.id);
    }

    static parse(id: UserToken | { id: string, isPublicKey?: boolean } | string, isPublic?: boolean): UserToken {
        if (id instanceof UserToken)
            return id;
        else if (typeof id === "string")
            return new UserToken(id, isPublic);
        else
            return new UserToken(id.id, isPublic || id.isPublicKey);
    }

    static isValidUser(id: UserToken | string, searchPublicKey: boolean = false): boolean {
        for (const user of userStore)
            if (id instanceof UserToken) {
                if (searchPublicKey) {
                    if (id.matches(user.userToken))
                        return true;
                } else {
                    if (id.matches(user.publicToken))
                        return true;
                }
            } else {
                if (searchPublicKey) {
                    if (id === user.publicToken)
                        return true;
                } else {
                    if (id === user.userToken)
                        return true;
                }
            }

        return false;
    }

    static fetchUserById(id: UserToken | string): User {
        if (id instanceof UserToken)
            return id.resolve();
        else
            return new UserToken(id).resolve();
    }

    resolve(): User {
        for (const user of User.users) // should the user have already been constructed, there's no need to recreate it, hence return the already existing instance
            if (user.matchId(this))
                return user;

        for (const user of userStore)
            if (this.isPublicKey && user.publicToken === this.id)
                return User.construct(user);
            else if (user.userToken === this || user.userToken === this.id)
                return User.construct(user);

        return null;
    }

    matches(id: string | UserToken): boolean {
        let token = id instanceof UserToken ? id.id : id;

        return token === this.id;
    }

    toString(): string {
        return this.id;
    }
}
