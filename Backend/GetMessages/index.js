
const container = require("../Shared/dbClient");

module.exports = async function (context, req) {
  const { user } = req.query;

  if (!user) {
    context.res = { status: 400, body: "Missing user parameter." };
    return;
  }

  const querySpec = {
    query: "SELECT * FROM c WHERE c.to = @user OR c.from = @user ORDER BY c.timestamp DESC",
    parameters: [{ name: "@user", value: user }]
  };

  const { resources: messages } = await container.items.query(querySpec).fetchAll();

  context.res = { status: 200, body: messages };
};
