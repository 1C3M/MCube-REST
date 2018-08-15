const restify = require("restify");
const logger = require("./logger");
const gmail = require("./routes//gmail");
const calendar = require("./routes/calendar");
//const token = require("./routes/token");


const server = restify.createServer();

logger.log({
    level:"info",
    message: "Rest Server Start"
});

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

server.use(restify.plugins.jsonp());
server.use(restify.plugins.bodyParser({mapParams:false}));

server.get("/:token/gmail/:count", gmail);
server.get("/:token/events/:count", calendar);
//server.get("/token/:token", token);
/* For JaeHyun image Request, Don't remove */
server.post("/image", (req, res) => {
    res.send("HI");
});

server.listen(8080, function() {
    logger.log({
        level: "info",
        message: `listening at ${server.url}`
    });
});
