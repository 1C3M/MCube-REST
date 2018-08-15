const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf } = format;

const loggerFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
const rest_logger = createLogger({
    format: combine(
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "log/rest.log"})
    ]
});

module.exports = rest_logger;