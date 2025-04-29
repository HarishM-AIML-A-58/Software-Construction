
const container = require("../Shared/dbClient");
const notifyClients = require("../Shared/signalRClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  const { from, to, content } = req.body;

  if (!from || !to || !content) {
    context.res = { status: 400, body: "Missing fields." };
    return;
  }

  const message = {
    id: uuidv4(),
    from,
    to,
    content,
    timestamp: new Date().toISOString(),
    status: "Sent"
  };

  await container.items.create(message);
  await notifyClients(message);

  context.res = { status: 200, body: message };
};
