import React from "react";

const SaveCredentialsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <header className="flex justify-between w-full p-4 bg-white shadow">
        <div className="logo">Logo</div>
        <button className="btn btn-primary">Connect</button>
      </header> */}
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter the website URL you're looking for"
            className="px-4 py-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 mb-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 mb-2 border rounded"
          />
          <button className="px-4 py-2 text-white bg-green-500 rounded">
            Submit
          </button>
        </div>
        <table className="table-auto bg-white shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Website</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Password</th>
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
