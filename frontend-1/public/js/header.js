// const { ethers } = require("ethers");

const connectWallet = async () => {

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log("chainId---- ", chainId);
    function handleChainChanged(chainId) {
      window.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x14a34" }],
      });
      // We recommend reloading the page, unless you must do otherwise.
      // window.location.reload()
    }
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log(account);
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: ['please give your approval', account],
        });
        // Recover the public key from the signature
        const msgHash = ethers.utils.hashMessage('please give your approval');
        const recoveredPublicKey = ethers.utils.recoverPublicKey(msgHash, signature);
        console.log("recoveredPublicKey ", recoveredPublicKey)
        document.getElementById("connect-button").textContent = account;
        localStorage.setItem("userAddress", account)
        localStorage.setItem("userPublickey", recoveredPublicKey)
        const result = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });

        const wei = parseInt(result, 16);
        const balance = wei / 10 ** 18;
        console.log(balance + " ETH");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };
  // Function to check if the wallet is already connected on page load
  async function checkIfWalletIsConnected() {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {

        console.log("wallet connected previously");
    } else {
            // Check if the wallet is still connected
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
              });
              if (accounts.length > 0 && accounts[0] === storedAddress) {
                console.log("Auto-reconnected:", storedAddress);
                // Update your UI or state here to reflect the reconnection
              } else {
                console.log("Stored address does not match any connected account");
                // localStorage.removeItem("userAddress"); // Clear storage if not connected
              }
    }
  }

  window.onload = async () => {
    // await checkIfWalletIsConnected();
    // handleMetaMaskEvents();
    // const encoder = new TextEncoder();
    // const decoder = new TextDecoder();
    // setTimeout(async ()=>{
    //   const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   const account = accounts[0];
      // const publicKeyBuffer = encoder.encode(localStorage.getItem('userPublickey').slice(2), 'hex'); // Remove '0x' and convert to buffer
      // const encryptedMessage = await crypto.encrypt(publicKeyBuffer, encoder.encode('please encrypt me'));
  
      // // Convert the encrypted message to a format that can be sent to MetaMask
      // const encryptedMessageString = JSON.stringify({
      //     version: "x25519-xsalsa20-poly1305",
      //     ephemPublicKey: encryptedMessage.ephemPublicKey.toString('base64'),
      //     nonce: encryptedMessage.nonce.toString('base64'),
      //     ciphertext: encryptedMessage.ciphertext.toString('base64'),
      // });
      // console.log("encryptedMessageString ", encryptedMessageString)

      // const message = 'encrypt it'
      // const encryptedData = crypto.publicEncrypt(
      //   {
      //       key: localStorage.getItem('userPublickey'),
      //       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      //       oaepHash: "sha256",
      //   },
      //   Buffer.from(message)
      // );
      // console.log("encryptedData== ", encryptedData)

      // const provider = new window.ethers.providers.Web3Provider(window.ethereum);
      // const decryptedMessage = await window.ethereum.request({
      //   method: 'eth_decrypt',
      //   params: [encrypted, account],
      // });
  
      // console.log("Decrypted Message:", decryptedMessage);


    //   var ciphertext = cryptoJs.AES.encrypt('my message', 'secret key 123').toString();

    //   // Decrypt
    //   var bytes  = cryptoJs.AES.decrypt(ciphertext, 'secret key 123');
    //   var originalText = bytes.toString(cryptoJs.enc.Utf8);

    //   console.log('originalText ===== ',originalText); // 'my message'

    
    // }, 10000)
  };

  window.onload = ()=>{
    setTimeout(()=>{
      const $tableBody = $('#table-body'); 
      axios.get('http://localhost:3000/api/getEncryptedCred')
      .then((response) => {
        console.log("response:..... ", response)
        if(response.status == 200){
        return response
        }
      })
      .then(response => {
          // You can now manipulate the data as needed
          const data = JSON.parse(JSON.stringify(response.data));
          for(let i =0; i< data.length; i++){
            
            // Create a new table row element
            const $row = $('<tr></tr>');
            $row.append(`<td>${data[i].appLink}</td>`);
            $row.append(`<td>${data[i].encryptedUser}</td>`);
            $row.append(`<td>${data[i].encryptedPassword}</td>`);
            
            // Append the row to the table body
            $tableBody.append($row);
          }
      })
      .catch(error => console.error('Error fetching data:', error));
    }, 100)
  };