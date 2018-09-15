const logger = require("../logger");
const Calendar = require("../google/calendar");
const Client = require("../google/client");

const routes = (req, res) => {
    let token = req.params.token;
    let client = new Client(token);
    client.connect().then( ()=> {
        let calendar = new Calendar(client);
        calendar.getTopSchedules(req.params.count).then( result =>{
            res.send(result);
        }).catch( err =>{
            logger.error(err);
            res.send("Fail");
        });
    });
};

module.exports = routes;