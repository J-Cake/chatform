import User, {UserSchema} from "./user";
import db from './db';

const userStore: UserSchema[] = db.loadUsers();

export default class UserToken { // the class used to represent a user rather than passing a user reference around everywhere
    id: string;

    constructor(id: string) {
        if (id.length >= 16)
            this.id = id;
    }

    static isValidUser(id: UserToken | string): boolean {
        for (const user of userStore)
            if (id instanceof UserToken && id.matches(user.userToken) || typeof id === "string" && id === user.userToken)
                return true;

        return false;
    }

    static fetchUserById(id: UserToken | string): User {
        if (id instanceof UserToken)
            return id.resolve();
        else
            new UserToken(id).resolve();

        return;
    }

    resolve(): User {
        for (const user of User.users) // should the user have already been constructed, there's no need to recreate it, hence return the already existing instance
            if (user.matchId(this))
                return user;

        for (const user of userStore)
            if (user.userToken === this || user.userToken === this.id)
                return User.construct(user);

        return null;
    }

    matches(id: string | UserToken): boolean {
        if (id instanceof UserToken)
            return id.id === this.id;
        else
            return this.id === id;
    }
}
