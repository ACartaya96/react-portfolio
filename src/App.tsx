import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import GameDev from "./components/GameDev/GameDev";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import SoftDev from "./components/SoftDev/SoftDev";
import { Routes, Route } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={"/about"} element={<About />} />
          <Route path={"/contact"} element={<Contact />} />
          <Route path={"/cs-projects"} element={<SoftDev />} />
          <Route path={"/gd-projects"} element={<GameDev />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
