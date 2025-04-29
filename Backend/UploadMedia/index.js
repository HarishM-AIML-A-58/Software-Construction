
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient("media");

  const buffer = Buffer.from(req.body, "base64");
  const blobName = `${Date.now()}.jpg`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer);

  context.res = {
    status: 200,
    body: { url: blockBlobClient.url }
  };
};
