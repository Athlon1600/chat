export default class NotFoundException extends Error {

    constructor(message: string = '404: Not Found') {
        super(message)
    }
}