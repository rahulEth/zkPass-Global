const connectWallet = async () => {
    console.log("wallet conntect......");

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

        document.getElementById("connect-button").textContent = account;
        localStorage.setItem("userAddress", account)

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
                localStorage.removeItem("userAddress"); // Clear storage if not connected
              }
    }
  }

  window.onload = async () => {
    await checkIfWalletIsConnected();
    // handleMetaMaskEvents();
  };