const axios = require("axios");
const crypto = require("crypto");
const readline = require('readline');

require('dotenv').config();

function randomPassword() {
    return crypto.randomBytes(200).toString('base64')
        .replace(/[^a-z0-9]/gi, '').substring(0, 20);
}

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function createRootUser() {

    const pwd = randomPassword();

    // attempt to create a ROOT user if one was not created already
    const response = await axios.post(BACKEND_URL + '/users/register', {
        username: 'root',
        password: pwd
    });

    const data = response.data;

    if ('error' in data) {
        console.log(response.data);
    } else {
        console.log(`New ROOT user was created with password: ${pwd}`);
        console.log('========= SAVE THIS FOR YOUR RECORDS OR LOSE ACCESS FOREVER =========');
    }
}

const processInput = async (option) => {

    await createRootUser();
}

const main = async () => {

    let lastInput = '';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    do {

        lastInput = await (new Promise((resolve) => {

            rl.question('What would you like to do? ', function (option) {
                resolve(option);
            });

        }));

        if (lastInput) {
            await processInput(lastInput);
        }

    } while (lastInput !== '');

    rl.close();

};

main().then(() => {

}).catch((err) => {
    console.log('Something went wrong');
    console.log(err);
})