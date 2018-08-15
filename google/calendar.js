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

    /*
    async getCalendarList() {
        const res = await this.google_calendar.calendarList.list({ auth: client.oAuth2Client});
        return res.data;
    }
    */
    async getTopSchedules(count) {
        logger.log({level:"info", message: `call calendar.getTopSchedules count:${count}`});
        const res = await this.google_calendar.events.lists({ userId: "me", });
        return res.data;
    }

}

let calendar = new Calendar();

module.exports = calendar;
