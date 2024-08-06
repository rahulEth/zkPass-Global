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
        <input
          type="text"
          placeholder="Search for collections, NFTs or users"
          className="px-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4">
          <a href="/" className="text-gray-600 hover:text-black">
            Create
          </a>
          <a href="/" className="text-gray-600 hover:text-black">
            Explore
          </a>
          <a href="/" className="text-gray-600 hover:text-black">
            Sell
          </a>
          <a
            href="/"
            className="text-gray-600 hover:text-black flex items-center"
          >
            Drops
            <span className="ml-1 text-xs bg-gray-200 text-gray-500 rounded-full px-1 py-0.5">
              NEW
            </span>
          </a>
        </nav>
        <button className="px-4 py-2 bg-green-500 text-white rounded-full">
          MARKETPLACE
        </button>
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
