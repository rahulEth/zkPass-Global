
const fs = require('fs');
const dotenv = require('dotenv');
const { Provider, Wallet, types } = require('zksync-ethers');
dotenv.config()
const {connectToDatabase} = require('./db.js');
// Example proving and verification keys for zkSNARK (replace with actual keys)
const provingKey = fs.readFileSync('circuit_final.zkey');
const verificationKey = JSON.parse(fs.readFileSync('verification_key.json'));


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
(async () => {
    // Register a new user
    await registerUser();
})();


