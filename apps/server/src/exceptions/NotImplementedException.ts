export default class NotImplementedException extends Error {

    constructor(message: string = '501: Not Implemented') {
        super(message)
    }
}