const logger = require("../logger");
const calendar = require("../google/calendar");

const routes = (req, res) => {
    calendar.getTopSchedules(req.params.count).then((result) =>{
        res.send(result);
    }).catch( err =>{
        res.send("Fail");
    });
};

module.exports = routes;