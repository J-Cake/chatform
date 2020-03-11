import UserLayout from "./API/UserLayout";
import http, {Result} from "./http";

export default class User {

    id: string;
    displayName: string;
    profilePictureUrl: string;

    constructor(userId: string) {
        this.id = userId;

        this.open();
    }

    async open(): Promise<User> {
        const user: UserLayout = (await http<{ code: number, message: UserLayout }>(`/api/userInfo/${this.id}`, Result.json) as { code: number, message: UserLayout }).message;

        this.displayName = user.userName;
        this.profilePictureUrl = user.profPicUrl;

        return this;
    }
}