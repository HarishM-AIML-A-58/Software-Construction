
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database("TextSphereDB");
const container = database.container("Messages");

module.exports = container;
