const { ethers } = require('ethers');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
// Initialize wallet with private key

const privateKey =  process.env.SIGNER_PRIVATEKEY //wallet.privateKey;
const wallet = new ethers.Wallet(privateKey);
const publicKey = wallet.publicKey;

// Function to convert a public key to an AES encryption key
function publicKeyToAesKey(publicKey) {
    // Use the first 32 bytes of the public key hash as the AES key
    const key = crypto.createHash('sha256').update(publicKey).digest().slice(0, 32);
    return key;
}

// Encrypt the message with the public key
function encryptWithPublicKey(publicKey, message) {
    const key = publicKeyToAesKey(publicKey);
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Decrypt the message with the private key
function decryptWithPrivateKey(privateKey, encryptedMessage) {
    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.publicKey;
    const key = publicKeyToAesKey(publicKey);
    const parts = encryptedMessage.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function main() {
    const message = 'This is a secret message';

    // Encrypt the message with the public key
    console.log({publicKey, message})
    const encryptedMessage = encryptWithPublicKey(publicKey, message);
    console.log('Encrypted Message:', encryptedMessage);

    // Decrypt the message with the private key
    const decryptedMessage = decryptWithPrivateKey(privateKey, encryptedMessage);
    console.log('Decrypted Message:', decryptedMessage);
}

main().catch(console.error);
