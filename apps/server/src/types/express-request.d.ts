
declare namespace Express {

    export interface Request {
        bearerToken: string | null;
        user: import("../models/User").User | null;
        admin: boolean;
    }
}
