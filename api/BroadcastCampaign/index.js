
const container = require("../Shared/dbClient");
const notifyClients = require("../Shared/signalRClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  const { from, message, targetUsers } = req.body;

  if (!from || !message || !Array.isArray(targetUsers)) {
    context.res = { status: 400, body: "Invalid input." };
    return;
  }

  const createdMessages = [];

  for (const to of targetUsers) {
    const msg = {
      id: uuidv4(),
      from,
      to,
      content: message,
      timestamp: new Date().toISOString(),
      status: "Sent"
    };

    await container.items.create(msg);
    await notifyClients(msg);
    createdMessages.push(msg);
  }

  context.res = { status: 200, body: createdMessages };
};
