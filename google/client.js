const fs = require("fs");
const path = require("path");
const {google} = require("googleapis");
const {MCubeDB, StatusEnum} = require("../mysql.js");
const logger = require("../logger.js");

const db = new MCubeDB();
db.connect();

const server_key_path = path.join(__dirname,"../../auth_path/client_secret_MCube.json");
let keys;
if (fs.existsSync(server_key_path)) {
    keys = JSON.parse(fs.readFileSync(server_key_path, "utf-8"));
    keys = keys.web;
}
class Client {
    constructor (userid="") {
        this.userid = userid;
        this.oAuth2Client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris[0]
        );
    }

    async connect () {
        this.oAuth2Client.credentials = await this.getCredential(this.userid);
        return await this.oAuth2Client;
    }

    async getCredential (userid="") {
        try{
            if (db.status !== StatusEnum.READY) await db.connect();
            return JSON.parse(await db.getGoogleTokenFromUserID(userid));
        }
        catch (err) {
            logger.error(err);
            return err;
        }
    }
}

let client = new Client("mcube123");
client.connect();
const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly"
];

module.exports = {client, scopes};
