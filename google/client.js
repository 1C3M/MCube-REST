/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */
/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */

const {google} = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const auth_path = 'auth_path';

const TOKEN_PATH = path.join(__dirname, auth_path+'/credentials.json');
const keyPath = path.join(__dirname, auth_path+'/client_secret.json');

let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).installed;
}

class Client {
    constructor (options) {
        this._options = options || { scopes: [] };

        // create an oAuth client to authorize the API call
        this.oAuth2Client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris[0]
        );
    }

    // Open an http server to accept the oauth callback. In this
    // simple example, the only request to our webserver is to
    // /oauth2callback?code=<code>
    async authenticate (scopes) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(TOKEN_PATH)) {
                let credentials = require(TOKEN_PATH);
                this.oAuth2Client.setCredentials(credentials);
                resolve(this.oAuth2Client);
                return;
            }
            let authorizeUrl = this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });
            console.log('Authorize this app by visiting this url:', authorizeUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code frome that page here: ', (code) =>{
                rl.close();
                this.oAuth2Client.getToken(code, (err, token) => {
                    if (err) return reject(err);
                    this.oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if(err) return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    resolve(this.oAuth2Client);
                })
            });
            // grab the url that will be used for authorization
        });
    }
}

let client = new Client();

const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar.readonly'
];
client.authenticate(scopes);

module.exports = client;
