import {SocketEventHandler} from "../types";
import {ChatJoin} from "./listeners/ChatJoin";
import {AuthLoginHandler} from "./listeners/AuthLoginHandler";
import {AuthLogoutHandler} from "./listeners/AuthLogoutHandler";
import {SendMessageListener} from "./listeners/SendMessageListener";

const messageHandlerMap: Map<string, SocketEventHandler> = new Map();

// defined
messageHandlerMap.set('join', ChatJoin);
messageHandlerMap.set('login', AuthLoginHandler);
messageHandlerMap.set('logout', AuthLogoutHandler);
messageHandlerMap.set('sendMessage', SendMessageListener);

export const socketListeners = messageHandlerMap;