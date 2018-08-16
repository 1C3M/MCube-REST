const {google} = require("googleapis");
const {client} = require("./client");
const logger = require("../logger.js");

class Gmail {
    constructor () {
        this.google_gmail = google.gmail({
            version: "v1",
            auth: client.oAuth2Client
        });
    }

    async getTopMessages(count) {
        logger.log({level:"info", message: `call gmail.getTopMessages count:${count}`});
        try{
            const res = await this.getMessageLists(count);
            const messages = res.messages;
            let results = [];
            for(let i = 0; i < count; i++) {
                const message = await this.google_gmail.users.messages.get({
                    userId: "me",
                    id: messages[i].id
                }, "full");
                results.push({
                    snippet: message.data.snippet,
                    from: message.data.payload.headers.filter((header) => { return header.name === "From"; })[0].value
                });
            }
            logger.log({level:"info", message: `end gmail.getTopMessages count:${count}`});
            return results;
        } catch (err) {
            logger.log(err);
            throw err;
        }
    }

    async getMessageLists() {
        logger.log({level:"info", message: "call gmail.getMessageLists"});
        try {
            const res = await this.google_gmail.users.messages.list({ userId: "me" });
            return res.data;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

}

let gmail = new Gmail();

module.exports = gmail;
