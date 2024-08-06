import React from "react";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="mb-8 text-2xl font-semibold text-center">
          Save your Web2 Credentials in a trustless manner
        </h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-white bg-blue-500 rounded">
            Save Credentials
          </button>
          <button className="px-4 py-2 text-white bg-blue-500 rounded">
            Get Credentials
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
