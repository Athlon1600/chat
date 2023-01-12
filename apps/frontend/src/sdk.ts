import {RestClient} from "@athlon1600/chat-sdk-js";

const defaultEndpointUrl: string = (function () {

    if (typeof window !== 'undefined') {
        return window.location.protocol + '//' + window.location.hostname + ':3000';
    }

    return 'http://localhost:3000'

})();

const BACKEND_URL = process.env.BACKEND_URL || defaultEndpointUrl;

if (typeof window === 'object') {

    const client = new RestClient({
        endpoint: BACKEND_URL
    });

    // @ts-ignore
    window.RestClientInstance = client;

    // @ts-ignore
    window.BACKEND_URL = BACKEND_URL;
}