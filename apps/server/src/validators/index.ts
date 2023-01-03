import {UserService} from "../services/UserService";

export const validateUsername = function (username: string): boolean {
    return username.length >= 4 && !UserService.RESERVED_USERNAMES.includes(username);
}

export const validatePassword = function (password: string): boolean {
    return password.length >= 8;
}

export const validateRoomName = function (name: string): boolean {
    return name.length < 200;
}

export const validateRoomDescription = function (description: string): boolean {
    return description.length < 200;
}