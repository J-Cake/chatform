import Chat from "../Chat";
import {Friend} from '../index';

export default interface State {
    activeChat?: Chat,
    friends?: Friend[],
    initUser?: string
};

export const defaults: State = {};
