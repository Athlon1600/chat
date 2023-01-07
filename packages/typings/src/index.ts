// root = first user
// TODO: admin = has access to /admin,
// owner = owner of room
// mod = can moderate this room, super_mod = can mod ALL rooms
export declare type USER_ROLE = "root" | "admin" | "owner" | "mod" | "super_mod"
    | "guest" | "user" | "registered" | "verified";

export declare type USER_BADGE = "vip";

// Alternatives: IUserDetails, IUserInfo, IUserInfo, UserSchema, UserDetails
export interface UserInterface {
    uid: string,
    displayName: string,
    picture: string,
    countryCode: string,
    balance: number,

    // relations
    roles: Array<USER_ROLE>;
}

export interface RoomInterface {
    uid: string,
    name: string,
    description: string,
    slowMode: number
}

type SystemMessageType = "info" | "warning" | "success" | "error";

/**
 * Messages that are sent by the SYSTEM rather by a user
 * Can be broadcast to individual user, multiple users, everyone in room, or just EVERYONE connected anywhere
 * They are NOT saved in the database, and are typically not displayed as part of regular room conversation
 */
export interface SystemMessageEvent {
    type: SystemMessageType,
    meta?: { [key: string]: string },
    text: string
}

export interface ChatMessageInterface {
    id: number;
    timestamp: number;
    message: string;
    user?: UserInterface,
    room?: RoomInterface
    deleted?: boolean,
}

export interface JoinEvent {
    uid: string
}

export interface LoginEvent {
    token: string;
}

export interface LogoutEvent {
    reason: string
}

export interface SendMessageEvent {
    text: string
}


export interface UserUpdatedEvent {
    user: UserInterface
}

// rename authStateChange
export interface AuthUpdatedEvent {
    user: UserInterface
}

export interface RoomUpdatedEvent {
    room: RoomInterface
}

export interface RoomMessagesEvent {
    messages: Array<ChatMessageInterface>
}

export interface RoomUsersEvent {
    users: Array<UserInterface>
}

export interface ChatErrorEvent {
    timestamp: number;
    message: string
}

export interface SendMessageEvent {
    timestamp?: number,
    text: string
}

export interface LogoutEvent {
    reason: string
}

export interface LoginEvent {
    token: string
}

export interface JoinEvent {
    uid: string
}

interface StringMap {
    [key: string]: any
}

// messages that server may send to client
interface ServerMessageMap {
    message: ChatMessageInterface,
    message_deleted: { ids: number }
    room_updated: RoomUpdatedEvent,
    room_messages: RoomMessagesEvent,
    room_users: RoomUsersEvent,
    room_purged: { deleted: boolean }
    auth_updated: AuthUpdatedEvent,
    user_updated: UserUpdatedEvent
    error: ChatErrorEvent,
    system: SystemMessageEvent
}

// messages that client will send to server
interface ClientMessageMap {
    join: JoinEvent,
    login: LoginEvent,
    logout: LogoutEvent,
    sendMessage: SendMessageEvent
}

// https://socket.io/docs/v4/typescript/
export type ServerToClientEvents = {
    [key in keyof ServerMessageMap]: (payload: ServerMessageMap[key]) => any
}

export type ClientToServerEvents = {
    [key in keyof ClientMessageMap]: (payload: ClientMessageMap[key]) => any
}

/*
export type ServerIO = Server<ClientToServerEvents, ServerToClientEvents>;
export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents>;

export type Socket = SocketIO<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, User>;
export type Namespace = NamespaceIO<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, User>;
export type Server = ServerIO<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, User>;
 */