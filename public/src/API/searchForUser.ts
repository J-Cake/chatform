import UserLayout from "./UserLayout";
import http, {Result} from "../http";

export default async function searchForUser(name: string): Promise<UserLayout[]> {
    return await http<UserLayout[]>(`/api/users?user=${name}`, Result.json) as UserLayout[];
}