import {App, Plugin} from 'vue';
import store from "./store";
import {RoomMessagesEvent, RoomUpdatedEvent, UserUpdatedEvent} from "@athlon1600/chat-typings";
import {RestClient, SocketClient} from "@athlon1600/chat-sdk-js";

interface SocketArgs {
    rest: RestClient;
    socket: SocketClient;
}

export const ClientPlugin: Plugin = {
    install: (app: App, options: SocketArgs) => {

        const myStore = store;
        const socketClient = options.socket;

        app.config.globalProperties.$store = myStore;

        // @ts-ignore
        app.config.globalProperties.$socket = socketClient;
        app.config.globalProperties.$rest = options.rest;

        // when room info had changed or when (null => new channel)
        // or its data has been changed (Slow mode changed from 3 seconds to 5)
        socketClient.once('room_updated', (payload: RoomUpdatedEvent) => {
            myStore.state.room = payload.room;
        });

        socketClient.once('auth_updated', (data: any) => {
            myStore.state.currentUser = data.user;
        });

        socketClient.once('user_updated', (data: UserUpdatedEvent) => {
            const {user} = data;
            myStore.actions.updateUser(user);
        });

        // messages from other CLIENTS
        socketClient.once('message', (msg: any) => {
            myStore.state.messages.push(msg);
        });

        socketClient.once('message_deleted', (data: any) => {
            const {ids} = data;
            myStore.actions.removeMessageById(ids);
        });

        // called once after join
        socketClient.once('room_messages', (event: RoomMessagesEvent) => {
            myStore.actions.setMessages(event.messages);
        });

        socketClient.once('room_purged', () => {
            myStore.actions.markAllMessagesAsDeleted();
        });

        socketClient.once('error', (data: any) => {
            myStore.state.error = JSON.stringify(data);
        });

        socketClient.connect();

        setInterval(() => {
            myStore.state.connected = socketClient.isConnected;
        }, 100);
    }
}