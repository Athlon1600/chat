import {createApp} from "vue";
import {ClientPlugin} from "./ClientPlugin";
import App from "./components/App.vue";

import "./scss/app.scss";
import {RestClient, SocketClient} from "@athlon1600/chat-sdk-js";
import {APP_CONFIG} from "./config";

const BACKEND_URI = APP_CONFIG.BACKEND_URL;
const SOCKET_URI = APP_CONFIG.WEBSOCKET_URL;

// TODO: expose RestClient instead and get websocketUrl from /api/websocket
const rest = new RestClient({
    endpoint: BACKEND_URI
});

const createSdk = function (element: Element, options: { login: string, room: string }, callback: any) {

    const socketClient = new SocketClient(SOCKET_URI);
    embed.api.socket = socketClient;

    if (options.login) {
        rest.setAuthToken(options.login);
        socketClient.loginUsingToken(options.login);
    }

    if (options.room) {
        socketClient.joinRoom(options.room);
    }

    const app = createApp(App);
    app.use(ClientPlugin, {
        rest: rest,
        socket: socketClient,
    });

    app.mount(element);

    embed._vm = app;

    callback();
}

interface IEmbed {
    init: any,
    _vm: any,
    api: {
        rest?: RestClient,
        socket?: SocketClient
    },
    util: any
}

function getQueryParam(name: string): string {
    const params: URLSearchParams = (new URL(document.location.toString())).searchParams;
    return params.get(name) || "";
}

function getHashParam(name: string): string {
    return "";
}

const embed: IEmbed = {
    init: createSdk,
    _vm: null,
    api: {
        rest: rest
    },
    util: {
        getQueryParam,
        getHashParam
    }
}

// @ts-ignore
window.$embed = embed;

