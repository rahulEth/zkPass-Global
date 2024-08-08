const { ethers } = require('ethers');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
// Initialize wallet with private key
const {connectToDatabase} = require('./db.js');

const privateKey =  process.env.WALLET_PRIVATE_KEY //wallet.privateKey;
console.log("privateKey" , privateKey)
const ethProvider = ethers.getDefaultProvider(process.env.ETH_SEPOLIA); // or 'rinkeby' for testnet

// const wallet = new ethers.Wallet(privateKey, ethProvider);
// console.log("wallet ", wallet)
// const publicKey = wallet.publicKey;
// console.log("publicKey ", publicKey)

// Function to convert a public key to an AES encryption key
function publicKeyToAesKey(publicKey) {
    // Use the first 32 bytes of the public key hash as the AES key
    const key = crypto.createHash('sha256').update(publicKey).digest().slice(0, 32);
    return key;
}

// Encrypt the message with the public key
function encryptWithPublicKey(publicKey, user, password) {
    const key = publicKeyToAesKey(publicKey);
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipherUser = crypto.createCipheriv('aes-256-cbc', key, iv);
    const cipherPassword = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipherUser.update(user, 'utf8', 'hex');
    let encrypted1 = cipherPassword.update(password, 'utf8', 'hex');

    encrypted += cipherUser.final('hex');
    encrypted1 += cipherPassword.final('hex');
    const encryptedUser = iv.toString('hex') + ':' + encrypted;
    const encryptedPassword = iv.toString('hex') + ':' + encrypted1;
    storeToDB(publicKey, encryptedUser, encryptedPassword)
    return {encryptedUser, encryptedPassword}
}

async function storeToDB(publicKey, encryptedUser, encryptedPassword){
    const db = await connectToDatabase();
    const collection = db.collection('zkpass-credentials');
    const result = await collection.insertOne({publicKey: publicKey, enUser:encryptedUser, enPass: encryptedPassword})
    console.log('document inserted Id ', result.insertedId.toString())
}

// Decrypt the message with the private key
function decryptWithPrivateKey(privateKey, user, password) {
    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.publicKey;
    const key = publicKeyToAesKey(publicKey);
    const userParts = user.split(':');
    const passwordParts = password.split(':');

    const iv = Buffer.from(userParts[0], 'hex');
    const encryptedUser = userParts[1];
    const encryptedPassword = passwordParts[1];

    const decipherUser = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decipherPassword = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decryptedUser = decipherUser.update(encryptedUser, 'hex', 'utf8');
    let decryptedPassword = decipherPassword.update(encryptedPassword, 'hex', 'utf8');
    
    decryptedUser += decipherUser.final('utf8');
    decryptedPassword += decipherPassword.final('utf8');
    return {decryptedUser, decryptedPassword};
}

async function main() {
    const user = 'xy@gmail.com';
    const password = 'mypass@123'
    const privateKey =  process.env.WALLET_PRIVATE_KEY //wallet.privateKey;
    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.publicKey;
    // Encrypt the message with the public key
    console.log({publicKey})
    const encrypted = encryptWithPublicKey(publicKey, user, password);
    console.log('Encrypted Message:', encrypted.encryptedUser, encrypted.encryptedPassword);



    // Decrypt the message with the private key
    const decryptedMessage = decryptWithPrivateKey(privateKey, encrypted.encryptedUser, encrypted.encryptedPassword);
    console.log('Decrypted Message:', decryptedMessage);
}

main().catch(console.error);
