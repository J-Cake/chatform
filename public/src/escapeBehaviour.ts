import setState from "./state/stateManager";

const behaviours: {
    [char: string]: string | ((following: string) => string)
} = {
    "<": "<",
    ">": ">",
    "@": function (next): string {
        const username = next.slice(1, next.indexOf(' ')).trim();

        if (username)
            return setState().friends.find(i => i.userName === username)?.userId;
        else
            return '@';
        // const usernameTerminator = next.indexOf('');
        // const username = next.slice(0, usernameTerminator);
        //
        // const friends = setState().friends;
        //
        // return friends.find(i => i.userName === username)?.userId || next.slice(usernameTerminator);
    }
};

export default behaviours;