const Client = require("./client.js");

class ClientCollection {
    constructor () {
        this.collection = {};
    }

    async getClientFromUserId (user_id="") {
        if (!(user_id  in this.collection)){
            let tmpClient = new Client(user_id);
            await tmpClient.connect();
            this.collection[user_id] = tmpClient;
        }
        return this.collection[user_id];
    }
}

let clientCollection = new ClientCollection();

exports.default = {clientCollection};
