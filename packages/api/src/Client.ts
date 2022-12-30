import {SimpleAxiosClient} from "./SimpleAxiosClient";
import {createClient} from "./create-client";

interface RestClientConfig {
    endpoint?: string,
    authToken?: string
}

interface BasicDeleteResponse {
    success: boolean,
    error: string
}

// simple stateless API using HTTP protocol
export default class Client {

    private baseUrl: string = '/';
    private token: string = '';

    protected configuration: RestClientConfig;
    protected simpleClient: SimpleAxiosClient;

    constructor(configuration: RestClientConfig) {
        this.configuration = configuration;
        this.baseUrl = configuration.endpoint ?? '/';

        const client = createClient(this.baseUrl, configuration.authToken);
        this.simpleClient = new SimpleAxiosClient(client);
    }

    // will recreate client
    public setClientOptions(options: RestClientConfig) {
        this.configuration = options;
        this.baseUrl = options.endpoint ?? '/';

        const client = createClient(this.baseUrl, options.authToken);
        this.simpleClient = new SimpleAxiosClient(client);
    }

    protected initClient() {
        const client = createClient(this.baseUrl, this.token);
        this.simpleClient = new SimpleAxiosClient(client);
    }

    public setAuthToken(token: string) {
        this.token = token;
        this.initClient();
    }

    async requestGet(uri: string): Promise<any> {
        return this.simpleClient.get(uri);
    }

    async login(username: string, password: string) {
        const data = {username, password};
        return this.simpleClient.post('/users/login', data);
    }

    async loginGuest() {
        return this.simpleClient.post('/users/login', {guest: 1});
    }

    // TODO: why not createUser
    async register(username: string, password: string): Promise<{ user: Object }> {
        return this.simpleClient.post('/users/register', {username, password});
    }

    async random() {
        return this.simpleClient.get('/random');
    }

    // -------------------- everything past this line requires authentication -------------------

    async getUsers() {
        return this.simpleClient.get('/users');
    }

    async getUser(uid: string) {
        return this.simpleClient.get('/users/' + uid);
    }

    async updateUser(uid: string, data: any) {
        return this.simpleClient.patch('/users/' + uid, data);
    }

    /**
     * Delete user non-permanently from database.
     *
     * @param uid
     */
    async deleteUser(uid: string): Promise<BasicDeleteResponse> {
        await this.simpleClient.delete('/users/' + encodeURIComponent(uid));

        return {
            success: true,
            error: ""
        }
    }

    async createRoom(name: string) {
        const data = {name};
        return this.simpleClient.post('/rooms', data);
    }

    async deleteRoom(uid: string) {
        return this.simpleClient.delete('/rooms/' + uid);
    }

    async getRoomMessages(roomUid: string): Promise<Array<any>> {
        const result = await this.simpleClient.get('/rooms/' + roomUid + '/messages');
        return result as Array<any>;
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        return this.simpleClient.delete('/messages/' + messageId);
    }
}
