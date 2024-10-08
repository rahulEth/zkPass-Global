
const fs = require('fs');
const dotenv = require('dotenv');
const Moralis = require("moralis").default;
// const { Provider, Wallet, types } = require('zksync-ethers');
dotenv.config()
const {connectToDatabase} = require('./db.js');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');


// index.js

const express = require('express');
const app = express();
const CryptoJS = require('crypto-js')
// Use CORS middleware
app.use(cors({origin: 'http://127.0.0.1:5500'}));

// Middleware to parse JSON bodies
app.use(express.json());
// Set the port number to listen on
const PORT = process.env.PORT || 3000;

// Define a simple route
app.post('/api/saveCred', (req, res) => {
    const publicKey = req.body.publicKey;
    const appLink = req.body.appLink;
    // Encrypt the message with the public key
    console.log("req.body.publicKey ", req.body.publicKey, req.body.signature)
    // const key = publicKeyToAesKey(publicKey);
    // const iv = crypto.randomBytes(16); // Initialization vector
    // const cipherUser = crypto.createCipheriv('aes-256-cbc', key, iv);
    // const cipherPassword = crypto.createCipheriv('aes-256-cbc', key, iv);
    // const cipherApplink = crypto.createCipheriv('aes-256-cbc', key, iv);
    // let encrypted = cipherUser.update(req.body.user, 'utf8', 'hex');
    // let encrypted1 = cipherPassword.update(req.body.password, 'utf8', 'hex');
    // let encrypted2 = cipherApplink.update(req.body.appLink, 'utf8', 'hex');

    // encrypted += cipherUser.final('hex');
    // encrypted1 += cipherPassword.final('hex');
    // encrypted2 += cipherApplink.final('hex');

    // const encryptedUser = iv.toString('hex') + ':' + encrypted;
    // const encryptedPassword = iv.toString('hex') + ':' + encrypted1;
    // const encryptedappLink = iv.toString('hex') + ':' + encrypted2;


    // Encrypt
    var encryptedUser = CryptoJS.AES.encrypt(req.body.user, req.body.signature).toString();
    var encryptedPassword = CryptoJS.AES.encrypt(req.body.password, req.body.signature).toString();
    var encryptedApplink = CryptoJS.AES.encrypt(req.body.appLink, req.body.signature).toString();

    uploadToIpfs(publicKey, encryptedUser, encryptedPassword, encryptedApplink, req.body.appLink)
    const newData = {publicKey, encryptedUser, encryptedPassword, appLink};


    // Read the existing data from the file
    fs.readFile('./saveCred.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;

        const jsonArray = data ? JSON.parse(data) : [];
        console.log('jsonA----- ', jsonArray)
        // Append the new data
        jsonArray.push(newData);

        // Write the updated array back to the file
        fs.writeFile('./saveCred.json', JSON.stringify(jsonArray, null, 2), (err) => {
            if (err) throw err;
            console.log('Data appended to file');
        });
    });
    return res.status(200).send({publicKey, encryptedUser, encryptedPassword, appLink})

});


  async function uploadToIpfs(publicKey, encryptedUser, encryptedPassword, encryptedappLink, appLink){
    const fileUploads = [
        {
            path: "zk-pass",
            content: {publicKey, encryptedUser, encryptedPassword, encryptedappLink}
        }
      ]
    if(!Moralis.Core.isStarted){
        await Moralis.start({
            apiKey: process.env.MORALIS_KEY
        })
    } else{
        console.log('Moralis is already started!')
    } 
    const res = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: fileUploads
    })
    console.log(res.result)
    storeToDB(publicKey, res.result, appLink)
}
async function storeToDB(publicKey, ipfsHash, appLink){
    const db = await connectToDatabase();
    const collection = db.collection('zkpass-credentials');
    const result = await collection.insertOne({publicKey, ipfsHash, appLink})
    console.log('document inserted Id ', result.insertedId.toString())
}

// Function to convert a public key to an AES encryption key
function publicKeyToAesKey(publicKey) {
    // Use the first 32 bytes of the public key hash as the AES key
    const key = crypto.createHash('sha256').update(publicKey).digest().slice(0, 32);
    return key;
}


app.get('/api/getCred',async  (req, res) => {
    console.log('req.param:/...... ', req.query.appLink)
    const db = await connectToDatabase();
    const collection = db.collection('zkpass-credentials');
    try{
        const result = await collection.findOne({appLink: req.query.appLink})
        console.log("result======= ", result)
        if(result){
            axios.get(result.ipfsHash[0].path)
            .then(response => {
                // Decrypt
                var bytes1  = CryptoJS.AES.decrypt(response.data.encryptedUser, req.query.signature);
                var bytes2  = CryptoJS.AES.decrypt(response.data.encryptedPassword,req.query.signature);
                var user = bytes1.toString(CryptoJS.enc.Utf8);
                var password = bytes2.toString(CryptoJS.enc.Utf8);

              console.log('Data:', response.data);
              res.status(200).send({user, password, appLink: req.query.appLink})
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        }else{
            res.status(500).send('credentials not found')
        }

    }catch(err){
        console.log('getCred ', err)
    }
});

app.get('/api/getEncryptedCred',async  (req, res) => {

    // Read the existing data from the file
    let jsonArray =[]
    fs.readFile('./saveCred.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        jsonArray = data ? JSON.parse(data) : [];
        return res.status(200).send(jsonArray)
    });

});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// User registration
async function registerUser() {
    const db = await connectToDatabase();
    const collection = db.collection('zkpass-collection');
    // const wallet = ethers.Wallet.createRandom();
    const privateKey =  process.env.SIGNER_PRIVATEKEY //wallet.privateKey;

    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.publicKey;

    const result = await collection.insertOne({publicKey: publicKey,address : wallet.getAddress()})
    console.log('document inserted Id ', result.insertedId.toString())
    console.log(`User Public Key: ${publicKey}`);
    // Store the public key on zkSync network
    // zkSync logic to store publicKey
    storePublicKey(publicKey, result.insertedId.toString())
}

async function storePublicKey(publicKey, dataHash) {
    // Connect to zkSync network
    let zkSyncProvider;
    try{
        // zkSync provider (L2)
        zkSyncProvider = new Provider(process.env.ZKSYNC_SEPOLIA); 
        const network = await zkSyncProvider.getNetwork();
        console.log('Connected to zkSync network:', network);
    }catch(err){
        console.log("zkSyncProvider: Error ", err)
    }
  
    let wallet ='';
    let ethProvider=''
    // Wallet setup - use your private key to create a signer
    try{
        const PRIVATE_KEY = process.env.SIGNER_PRIVATEKEY; // Replace with your private key
        // Ethereum provider (L1)
        ethProvider = ethers.getDefaultProvider(process.env.ETH_SEPOLIA); // or 'rinkeby' for testnet
        wallet = new ethers.Wallet(PRIVATE_KEY, ethProvider);
        const network = await ethProvider.getNetwork()
        console.log('eth network ', network)
    }catch(err){
        console.log("etherProvider: Error ", err)
        return
    }
  
    // Create zkSync wallet
    let zkSyncWallet = ''
    try{
        const unconnectedWallet = new Wallet(process.env.SIGNER_PRIVATEKEY);
        zkSyncWallet = unconnectedWallet.connect(zkSyncProvider).connectToL1(ethProvider);
        const bal = await zkSyncWallet.getBalance();
        console.log('zksync era balance: ', bal)
        // zkSyncWallet = await zksync.Wallet.fromEthSigner(wallet, zkSyncProvider);
    }catch(err){
        console.log('zkSyncWallet: error ',err)
    }
  
    // user public key
    // const newKeyPair = ethers.utils.randomBytes(32);
    // const newPublicKey = ethers.utils.computePublicKey(newKeyPair, false);
    const newPublicKey = publicKey;
  
    const nonce = await zkSyncWallet.getNonce()
    console.log('nonce...... ', nonce)
    // Store the public key on zkSync network

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ContractArtifact.abi, zkSyncWallet);
    const tx = await contract.storeProof(newPublicKey, dataHash)
    tx.wait()
    console.log("transaxtion Id ", tx, tx.hash)

    const encodedPacked = ethers.utils.solidityPack(
        ['string', 'string', 'uint256'],
        [publicKey, dataHash, tx.timestamp]
      );
      
      // Keccak256 hashing
      const hash = ethers.utils.keccak256(encodedPacked);
      console.log("hash......", hash)
      const value = contract.getProof(hash)
      console.log('stored proof: ', value)
    console.log('Public key stored:', newPublicKey);
  }

// Example usage
// (async () => {
//     // Register a new user
//     await registerUser();
// })();


