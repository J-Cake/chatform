import Chat from "./Chat";
import setState from "./state/stateManager";

export default async function loadChat(id: string): Promise<Chat> {
    setState({
        activeChat: await Chat.resolve(id)
    });

    return;
}