import React from "react";

const GetCredentialsPage = () => {
  const handlClick = (e) => {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen   max-w-6xl mx-auto">
      {/* <header className="flex justify-between w-full p-4 bg-white shadow">
        <div className="logo">Logo</div>
        <button className="btn btn-primary">Connect</button>
      </header> */}
      <main className="flex flex-col items-center justify-start mt-20 flex-1 p-4 max-w-3xl mx-auto w-full">
        <h1 className="logo text-[60px] font-bold">Get you Credentials</h1>

        <div className="flex w-full gap-3 mt-10">
          <input
            type="text"
            placeholder="Enter the website name you are looking for "
            className="px-4 py-2 mb-4 border rounded  w-full"
          />
          <button
            onClick={handlClick}
            className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
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

export default GetCredentialsPage;
