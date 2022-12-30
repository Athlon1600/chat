import axios, {AxiosInstance} from "axios";

export const createClient = function (baseURL = '', token = ''): AxiosInstance {

    const headers: any = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    return axios.create({
        baseURL: baseURL,
        headers
    });
}