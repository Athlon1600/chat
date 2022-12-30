import {RestClient} from "@athlon1600/chat-sdk-js";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

if (typeof window === 'object') {

    const client = new RestClient({
        endpoint: BACKEND_URL
    });

    // @ts-ignore
    window.RestClientInstance = client;

    // @ts-ignore
    window.BACKEND_URL = BACKEND_URL;
}