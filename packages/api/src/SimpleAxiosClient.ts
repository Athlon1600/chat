import {AxiosInstance, AxiosResponse} from "axios";

const responseBody = (response: AxiosResponse) => response.data;

export class SimpleAxiosClient {

    private client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    async get(url: string, params?: any) {
        return this.client.get(url, params).then(responseBody)
    }

    async post(url: string, body: {}) {
        return this.client.post(url, body).then(responseBody)
    }

    async put(url: string, body: {}) {
        return this.client.put(url, body).then(responseBody)
    }

    async patch(url: string, body: {}) {
        return this.client.patch(url, body).then(responseBody);
    }

    async delete(url: string) {
        return this.client.delete(url).then(responseBody)
    }
}