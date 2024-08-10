document.getElementById('submitButton').addEventListener('click', function(event){
  event.preventDefault(); 
  saveCred()
});
const saveCred = async () => {
    // Send POST request using Axios
      // Request account access if needed
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
      // The public key (Ethereum address) is the first account
      const publicKey = accounts[0];
      const user = document.getElementById("user").textContent;
      const password = document.getElementById("password").textContent;
      console.log({publicKey, user, password})
    const data = {
      publicKey, user:'user1', password:'password1'
    }
    axios.post('http://localhost:3000/api/saveCred', data)
        .then(response => {
            console.log('Response:', response.data);
            alert('credentials saved successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending data.');
        });
  };
  //   async function uploadToIpfs(user, password, app){

  //     await Moralis.start({
  //         apiKey: env.MORALIS_KEY
  //     })
  //     const fileUploads = [
  //         {
  //             path: "zk-pass",
  //             content: {user, password, app }
  //         }
  //       ]
  //     const res = await Moralis.EvmApi.ipfs.uploadFolder({
  //         abi: fileUploads
  //     })
  //     console.log(res.result)
  //     return res.result;
  // }
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        // Already connected
        console.log("Already connected:", accounts[0]);
        document.getElementById("connect-button").textContent = accounts[0];
        // Update your UI or state to reflect the connected account
      } else {
        // Not connected, so prompt user to connect
        try {
          const newAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("Connected:", newAccounts[0]);
          // Update your UI or state to reflect the newly connected account
          document.getElementById("connect-button").textContent = accounts[0];
        } catch (error) {
          console.error("User denied account access", error);
        }
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };
  // connectWallet()