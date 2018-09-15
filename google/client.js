const fs = require("fs");
const path = require("path");
const {google} = require("googleapis");
const {MCubedb, StatusEnum} = require("../mysql.js");
const logger = require("../logger.js");

const auth_path = "../../auth_path";
const server_key_path = path.join(__dirname, auth_path+"/client_secret_MCube.json");
let keys;
if (fs.existsSync(server_key_path)) {
    keys = JSON.parse(fs.readFileSync(server_key_path, "utf-8"));
    keys = keys.web;
}
class Client {
    constructor (token) {
        this.token = token;
        this.oAuth2Client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris[0]
        );
    }

    async connect () {
        try{
            this.userid = await MCubedb.getUserIDFromMMToken(this.token);
            this.oAuth2Client.setCredentials(await this.getCredential(await this.userid));
            return await this.oAuth2Client;
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getCredential (userid="") {
        try{
            let data = await MCubedb.getGoogleTokenFromUserID(userid);
            return JSON.parse(await data);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly"
];

module.exports = {Client, scopes};
