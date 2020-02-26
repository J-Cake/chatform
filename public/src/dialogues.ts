import Modal from "./modal";

import findUser from './findUser'

const dialogues = {
    friendSearch: new Modal<{
        friendId: string
    }>("Search For Friends", `<div class="friend">
    <input type="text" name="username" placeholder="User Name" id="username-search"/>
    <div class="people">
        <span>Enter a user name</span>
    </div>
</div>`).init(findUser)
};

export default dialogues;