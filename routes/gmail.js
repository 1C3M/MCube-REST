const Gmail = require("../google/gmail.js");
const {Client} = require("../google/client");

const routes = (req, res) => {
    let token = req.params.token;
    let client = new Client(token);
    client.connect().then(() => {
        let gmail = new Gmail(client);
        gmail.getTopMessages(req.params.count)
            .then(result => {
                res.send(result);
            });
    });
};

module.exports = routes;
