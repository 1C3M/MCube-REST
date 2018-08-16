const gmail = require("../google/gmail.js");

const routes = (req, res) => {
    gmail.getTopMessages(req.params.count)
        .then(result => {
            res.send(result);
        });
};

module.exports = routes;
