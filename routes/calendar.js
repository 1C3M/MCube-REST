const calendar = require("../google/calendar");

const routes = (req, res) => {
    calendar.getTopSchedules(req.params.count).then((result) =>{
        res.send(result);
    });
};

module.exports = routes;