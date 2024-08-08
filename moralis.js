const Moralis = require("moralis").default;
const fs = require("fs");
require("dotenv").config();

const axios = require('axios')

const fileUploads = [
    {
        path: "zk-pass",
        content: {user: 'user1@gmail.com', password: 'mypass1@123', app :  'https://amazon.in'}
    }
  ]

  async function uploadToIpfs(){
    await Moralis.start({
        apiKey: process.env.MORALIS_KEY
    })
    const res = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: fileUploads
    })
    console.log(res.result)
}
// uploadToIpfs();

async function getFromIpfs(url) {
  axios.get(url)
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
    
}

getFromIpfs('https://ipfs.moralis.io:2053/ipfs/QmNirGmbpA8aAR3Dy2S1Q1Ynic9DbRRxZext5Z31VJAcy2/zk-pass')