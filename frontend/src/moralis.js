// import Moralis from 'moralis';
// const env = require("./envfile");
const Moralis = require("moralis").default;

// console.log("env.MORALIS_KEY..... ", env.MORALIS_KEY);
const axios = require("axios");

async function uploadToIpfs(user, password, app) {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU2NzhlNzRjLTU2ODQtNGM1OS1iYTBkLWUxYjRjZTJiYmI0YyIsIm9yZ0lkIjoiNDAzMTg1IiwidXNlcklkIjoiNDE0Mjk4IiwidHlwZUlkIjoiMzcyNGU5MTctNTY5Ni00MzgyLWFmNWItMjIyZjc2MDI4YmQ3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjI5Mzk0NTQsImV4cCI6NDg3ODY5OTQ1NH0.uKU-OyHtrV5R9rySrqSw30T0-9AoI-xA3yNW2YSpTLM",
  });
  const fileUploads = [
    {
      path: "zk-pass",
      content: { user, password, app },
    },
  ];
  const res = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: fileUploads,
  });
  console.log(res.result);
  return res.result;
}
// uploadToIpfs();

async function getFromIpfs(url) {
  axios
    .get(url)
    .then((response) => {
      console.log("Data:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

module.exports = { uploadToIpfs };
