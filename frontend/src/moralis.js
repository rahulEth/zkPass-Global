// import Moralis from 'moralis';
const env = require('./envfile');
const Moralis = require('moralis').default;

console.log("env.MORALIS_KEY..... ", env.MORALIS_KEY)
const axios = require('axios')

  async function uploadToIpfs(user, password, app){

    await Moralis.start({
        apiKey: env.MORALIS_KEY
    })
    const fileUploads = [
        {
            path: "zk-pass",
            content: {user, password, app }
        }
      ]    
    const res = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: fileUploads
    })
    console.log(res.result)
    return res.result;
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


module.exports = {uploadToIpfs}