import {Request, Response} from "express";

export class WebsocketController {

    static async open(req: Request, res: Response) {

        // TODO: wss when connecting over ws
        const url = `ws://${req.hostname}:${req.socket.localPort}/ws?room=bob&token=XXX`;

        // The URL to which to connect; this should be the URL to which the WebSocket server will respond.
        // The token should be used within 15 minutes of creation.

        res.json({
            websocketUrl: url,
            token: 'WW91ciBhdXRoZW50aWNhdGlvbiB0b2tlbiBnb2VzIGhlcmUu',
            error: null
        });
    }
}