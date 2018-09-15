const {google} = require("googleapis");
const {Client} = require("./client");
const logger = require("../logger.js");

class Gmail {
    constructor (client) {
        this.setClient(client);
    }

    setClient (client) {
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
                    subject: message.data.payload.headers.filter((header) => { return header.name === "Subject"; })[0].value,
                    from: message.data.payload.headers.filter((header) => { return header.name === "From"; })[0].value,
                    date: message.data.payload.headers.filter((header) => { return header.name === "Date"})[0].value
                });
            }
            logger.log({level:"info", message: `end gmail.getTopMessages count:${count}`});
            return results;
        } catch (err) {
            logger.error(err);
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

module.exports = Gmail;
