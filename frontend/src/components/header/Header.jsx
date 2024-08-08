import React from "react";

const Header = () => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log(account);

        document.getElementById("connect-button").textContent = account;

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

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/32x32.png?text=R"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="font-bold text-lg">Logo</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          id="connect-button"
          className="px-4 py-2 bg-primary text-white bg-blue-500 rounded"
          onClick={connectWallet}
        >
          Connect wallet
        </button>
        {/* <button title="l" className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button> */}
      </div>
    </header>
  );
};

export default Header;
