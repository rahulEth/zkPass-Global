import "./App.css";
// import useEffect from "react";
// import AnalogWatch from "./components/AnalogWatch";
// import Todo from "./components/Todo";
// import Accordian from "./components/Accordian";
import LandingPage from "./components/landingpage/LandingPage";
import SaveCredentialsPage from "./components/landingpage/SaveCredentialsPage";
import GetCredentialsPage from "./components/landingpage/GetCredentialsPage";
import Header from "./components/header/Header";

function App() {
  // useEffect(() => {
  //   const res = fetch("https://v2.jokeapi.dev/joke/Programming").then(
  //     (response) => {
  //       return response.json();
  //     }
  //   );
  // }, []);
  return (
    <>
      <div className="App">
        {/* <AnalogWatch /> */}
        {/* <Accordian />*/}
        <Header />
        <LandingPage />
        <SaveCredentialsPage />
        <GetCredentialsPage />
      </div>
    </>
  );
}

export default App;
