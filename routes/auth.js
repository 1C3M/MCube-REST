const path = require("path");
const fs = require("fs");
const PythonShell = require("python-shell");
const logger = require("../logger");
const {MCubedb} = require("../mysql");

const configFilename = "config.json";
if(!fs.existsSync(configFilename)) {
    throw "No Config File";
}

const configData = JSON.parse(fs.readFileSync(configFilename, "utf-8"));

const recognizePy = configData.faceRec.recognizePy;
const scriptPath = configData.faceRec.scriptPath;
const pythonPath = configData.faceRec.pythonPath;
const npyPath = configData.faceRec.npyPath;

const routes = (req, res) => {
    try {
        let token = req.params.token;
        let encoding = req.body.encodings[0];
        let pyshell = new PythonShell(recognizePy, {pythonPath: pythonPath, scriptPath: scriptPath});
        logger.info(encoding);
        logger.info(npyPath);
        pyshell.send(npyPath);
        pyshell.send(encoding);

        pyshell.on("message", (message) => {
            logger.info(`token : ${token} message : ${message}`);
            if (message !== "Unknown") MCubedb.updateMMToken(message, token);
        });
        res.send("HI");
    } catch (err) {
        res.send("Fail");
        logger.error(err);
    }
};

module.exports = routes;
