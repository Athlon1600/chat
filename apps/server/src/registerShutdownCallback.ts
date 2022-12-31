import {AsyncUtils} from "./framework/util/AsyncUtils";
import Signals = NodeJS.Signals;

const SHUTDOWN_SIGNALS: Array<Signals> = [
    'SIGHUP',
    'SIGINT',
    'SIGTERM',
    // 'SIGKILL'
];

const SHUTDOWN_TIMEOUT: number = 15000;
const SHUTDOWN_WAIT_BEFORE: number = 600;

type BeforeShutdownCallback = (signalOrEvent: string) => any;

const callbacks: Array<BeforeShutdownCallback> = [];

async function shutdown(code: Signals) {

    // just end it if it takes too long...
    setTimeout(() => {
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    for (const listener of callbacks) {

        try {
            await listener(code);
        } catch (e) {
            console.error(e);
        }
    }

    await AsyncUtils.sleep(SHUTDOWN_WAIT_BEFORE);

    process.exit(0);
}

function registerShutdownEventListeners() {

    (SHUTDOWN_SIGNALS as Signals[]).forEach((signal: Signals) => {

        process.once(signal, async function () {
            await shutdown(signal);
        });

    });
}

export const registerShutdownCallback = (callback: BeforeShutdownCallback) => {
    registerShutdownEventListeners();
    callbacks.push(callback);
}