
// TODO: split off into MissingAuthentication or PermissionDenied?
export default class UnauthorizedException extends Error {

    constructor(message: string = '401 Unauthorized') {
        super(message)
    }
}