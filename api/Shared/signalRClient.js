
const axios = require("axios");

const notifyClients = async (message) => {
  await axios.post(process.env.SIGNALR_CONNECTION_STRING, {
    target: "newMessage",
    arguments: [message],
  });
};

module.exports = notifyClients;
