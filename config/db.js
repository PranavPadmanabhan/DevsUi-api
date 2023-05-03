const { W3dbV2 } = require("w3db-v2")

const { SECRET, RPC_URL, PROJECT_ID, OWNER } = process.env

const config = {
    address: OWNER,
    projectId: PROJECT_ID,
    secret: SECRET,
    mumbaiRPC: RPC_URL
}

const db = new W3dbV2(config);

const Conversations = db.collection('conversations');
const Users = db.collection("Users");


module.exports = { db,Conversations,Users }