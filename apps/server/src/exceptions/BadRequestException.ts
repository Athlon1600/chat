export default class BadRequestException extends Error {

    constructor(message: string = '400 Bad Request') {
        super(message)
    }
}