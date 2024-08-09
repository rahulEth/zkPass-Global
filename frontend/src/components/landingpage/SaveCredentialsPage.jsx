import React from "react";
import { uploadToIpfs }  from "../../moralis.js";
const SaveCredentialsPage = () => {
  const handlClick = async (e) => {
    const resp = await uploadToIpfs('user1', 'password1', 'app1')
    console.log('resp------ ', resp)
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
  const connectWallet = async ()=>{
    if(window.ethereum){
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
          // Already connected
          console.log('Already connected:', accounts[0]);
          document.getElementById("connect-button").textContent = accounts[0];
          // Update your UI or state to reflect the connected account
      }else{
          // Not connected, so prompt user to connect
          try {
              const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log('Connected:', newAccounts[0]);
              // Update your UI or state to reflect the newly connected account
          document.getElementById("connect-button").textContent = accounts[0];
          } catch (error) {
              console.error('User denied account access', error);
          }
      }
    } else{
      console.error('MetaMask is not installed');
    }
  }
  // connectWallet() 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg max-w-6xl mx-auto">
      {/* <h1 className="w-full p-4 bg-white shadow"> */}
      {/* </h1> */}
      <main className="flex flex-col items-center justify-start flex-1 mt-20 p-4">
        <h1 className="logo text-[60px] font-bold">Save you Credentials</h1>
        <div className="mb-4 mt-10 flex gap-2">
          <input
            type="text"
            placeholder="Enter the website URL you're looking for"
            className="px-4 py-2 mb2 border rounded"
          />
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 mb2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 mb2 border rounded"
          />
          <button
            onClick={handlClick}
            className="px-4 py- text-white bg-blue-500 rounded"
          >
            Submit
          </button>
        </div>
        <table className="table-auto bg-white shadow-lg w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-left">Website</th>
              <th className="px-4 py-2 border text-left">Username</th>
              <th className="px-4 py-2 border text-left">Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">https://amazon.in</td>
              <td className="px-4 py-2 border">myname@gmail.com</td>
              <td className="px-4 py-2 border">VFR#1234</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SaveCredentialsPage;
