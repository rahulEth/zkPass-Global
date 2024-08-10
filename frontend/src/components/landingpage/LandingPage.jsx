import React from "react";

import "./style.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="hero-section flex flex-col items-center justify-center min-h-[85vh] ">
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="mb-8 text-[60px] text-[#000] font-bold text-center mx-auto max-w-4xl z-[999999] opacity-100 leading-[120%]">
          Save your Web2 Credentials in a trustless manner
        </h1>
        <div className="flex space-x-4">
          <Link
            to="/SaveCredentials"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Save Credentials
          </Link>
          <Link
            to="/GetCredentials"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Get Credentials
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
