import http, {Method, Result} from "./http";
import UserLayout from "./API/UserLayout";
import * as StateManager from './state/stateManager';

export default function findUser() {
    const textField = this.container.querySelector("#username-search");

    const userList = this.container.querySelector(".people");

    const onChange = async function (e) {
        const users: UserLayout[] = (await http<{ code: number, message: UserLayout[] }>(`/api/users?user=${textField.value}`, Result.json) as { code: number, message: UserLayout[] }).message;

        const newUsers: string[] = users.map(i => i.userId);
        const existing: UserLayout[] = [];

        for (const child of userList.children)
            if (!newUsers.includes(child.getAttribute(`data-id`)))
                child.remove();

        for (const user of users)
            if (userList.querySelector(`[data-id="${user.userId}"]`) === null) {
                const userContainer = document.createElement("div");
                userContainer.classList.add('user-list');

                userContainer.innerHTML = `<div class="name" data-id="${user.userId}">${user.userName}</div>`; // add things in here

                userContainer.addEventListener("click", function () {
                    StateManager.dispatch("updateFriendList", {});
                    http<{ code: number, message: string }>(`/api/friend?user=${user.userId}`, Result.json, Method.put).then(function (response: { code: number, message: string }) {
                        if (response.code === 0) {
                            userContainer.innerHTML = 'Friend added';
                            userContainer.classList.add('fade');
                            setTimeout(() => userContainer.remove(), 2000);
                        } else {
                            userContainer.classList.add('error');
                            setTimeout(() => userContainer.classList.remove('error'))
                        }
                    })
                });

                userList.appendChild(userContainer);
            }
    };

    textField.addEventListener("input", onChange);
}