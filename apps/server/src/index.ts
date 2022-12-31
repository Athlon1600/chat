import {ServerApplication} from "./ServerApplication";
import {Config} from "./config";

const server = new ServerApplication();

const port = Config.server.port;

// TODO: check if redis is working

server.start(port).then(() => {
    console.log('started!');
})