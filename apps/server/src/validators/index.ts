import {UserService} from "../services/UserService";

export const validateUsername = function (username: string): boolean {
    return username.length >= 4 && !UserService.RESERVED_USERNAMES.includes(username);
}

export const validatePassword = function (password: string): boolean {
    return password.length >= 8;
}