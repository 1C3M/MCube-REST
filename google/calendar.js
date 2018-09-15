const {google} = require("googleapis");
const client = require("./client");
const logger = require("../logger.js");

class Calendar {
    constructor () {
        this.google_calendar = google.calendar({
            version:"v3",
            auth: client.oAuth2Client
        });
    }

    async getTopSchedules(count) {
        logger.log({level:"info", message: `call calendar.getTopSchedules count:${count}`});
        try {
            const res = await this.google_calendar.events.list({calendarId: "me",});
            return res.data;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = Calendar;
