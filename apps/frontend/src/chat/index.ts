import {createApp} from "vue";
import {ClientPlugin} from "./ClientPlugin";
import App from "./components/App.vue";

import "./scss/app.scss";
import {RestClient, SocketClient} from "@athlon1600/chat-sdk-js";
import {APP_CONFIG} from "./config";

const BACKEND_URI = APP_CONFIG.BACKEND_URL;
const SOCKET_URI = APP_CONFIG.WEBSOCKET_URL;

const createSdk = function (element: Element, options: { login: string, room: string }, callback: any) {

    // TODO: expose RestClient instead and get websocketUrl from /api/websocket
    const rest = new RestClient({
        endpoint: BACKEND_URI
    });

    const socketClient = new SocketClient(SOCKET_URI);

    embed.api = {
        rest: rest,
        socket: socketClient
    };

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
        rest: RestClient,
        socket: SocketClient
    } | null,
    util: any
}

const embed: IEmbed = {
    init: createSdk,
    _vm: null,
    api: null,
    util: {
        getQueryParam() {

        }
    }
}

// @ts-ignore
window.$embed = embed;

