import {User} from "../models/User";
import {ChatCommand} from "../websocket/ChatCommand";
import {SocketSession} from "../websocket/SocketSession";

export type UserOrNull = User | null;

type Nullable<T> = T | null;
type NullablePromise<T> = Promise<Nullable<T>>;

export interface StringMap {
    [key: string]: string;
}

export type MapOfNumberSetsWithNumberKeys = Map<number, Set<number>>;

export declare type Constructor<T = any> = (new (...args: any[]) => T);

// tslint:disable-next-line:ban-types
export type Instance<T extends Object = Object> = T;

export type StaticThis<T> = { new(): T };
export type StaticThisWithArgs<T> = { new(...args: any[]): T };

export interface ObjectWithStringKeys {
    [key: string]: any;
}

export type CommandHandler = (command: ChatCommand, session: SocketSession) => Promise<void>;
export type SocketEventHandler = (connection: SocketSession, payload: any) => Promise<void>;

// TODO: PaginationQuery
export interface PaginationInterface {
    offset: number;
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number
}

export type GeoIPResponse = {
    continentCode?: string;
    countryCode: string;
    countryName: string;
    latitude: number;
    longitude: number;
    region: string;
    city: string;
    postalCode: string;
}
