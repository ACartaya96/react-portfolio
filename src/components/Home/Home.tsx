import { Link } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import { useEffect } from "react";
import LogoAC from "../../assets/images/logo-ac.png";
import "./Home.scss";

function Home() {
  useEffect(() => {
    PowerGlitch.glitch(".glitch-home-logo", { timing: { iterations: 1 } });
    PowerGlitch.glitch(".glitch-hover-contact", {
      playMode: "hover",
      shake: {
        velocity: 12,
        amplitudeX: 0.63,
        amplitudeY: 1.1,
      },
      slice: {
        count: 5,
        velocity: 10,
        maxHeight: 0.5,
      },
      hideOverflow: true,
    });
  }, []);

  return (
    <div className="container home-page">
      <div className="text-zone">
        <h1>
          Hi, <br />
          I'm Alexander Cartaya
          <br />
          Software Developer
        </h1>
        <h2>
          Fullstack Developer / Game Developer / Ai Machine Learning Enthusiast
        </h2>
        <Link to="/contact" className="flat-button glitch-hover-contact">
          CONTACT ME
        </Link>
      </div>
      <div className="logo-container">
        <img className="home-logo glitch-home-logo" src={LogoAC} alt="AC" />
      </div>
    </div>
  );
}

export default Home;
