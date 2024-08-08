import "./App.css";

import LandingPage from "./components/landingpage/LandingPage";
import SaveCredentialsPage from "./components/landingpage/SaveCredentialsPage";
import GetCredentialsPage from "./components/landingpage/GetCredentialsPage";
import Header from "./components/header/Header";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route
              exact
              path="/SaveCredentials"
              element={<SaveCredentialsPage />}
            />
            <Route
              exact
              path="/GetCredentials"
              element={<GetCredentialsPage />}
            />
            {/* <SaveCredentialsPage />
            <GetCredentialsPage /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
