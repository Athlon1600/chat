import store from "./store";
import {RestClient, SocketClient} from "@athlon1600/chat-sdk-js";

// make this file a module
export {}

declare global {
    interface Window {
        chat: Object
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $store: typeof store,
        $rest: RestClient,
        $socket: SocketClient
    }
}