const path = require("path");
const fs = require("fs");
const PythonShell = require("python-shell");
const logger = require("../logger");

const configFilename = path.join(__dirname, "config.json");
if(!fs.existsSync(configFilename)) {
    throw "No Config File";
}

const configData = JSON.parse(fs.readFileSync(configFilename, "utf-8"));

const recognizePy = configData.faceRec.recognizePy;
const scriptPath = configData.faceRec.scriptPath;
const pythonPath = configData.faceRec.pythonPath;
const npyPath = configData.faceRec.npyPath;

const routes = (req, res) => {
    let encoding = req.body.encodings[0];
    let pyshell = new PythonShell(recognizePy, {pythonPath:pythonPath, scriptPath:scriptPath});
    pyshell.send(npyPath);
    pyshell.send(encoding);

    pyshell.on("message", (message) => {
        logger.info(message);
        res.send(message);
    });
};

module.exports = routes;
