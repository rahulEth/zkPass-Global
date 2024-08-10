const saveCred = async (e) => {
    const resp = await uploadToIpfs("user1", "password1", "app1");
    console.log("resp------ ", resp);
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