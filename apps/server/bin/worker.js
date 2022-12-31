#!/usr/bin/env node

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async function () {

    console.log('Hello!');

    // set this cron job top run every 1 minute or such
    // download geoip2

    while (1) {
        await sleep(1000);

        const ts = (new Date()).toTimeString();
        console.log(ts);
    }

})();

