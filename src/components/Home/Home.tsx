import { Link } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import { useEffect } from "react";
import LogoAC from "../../assets/images/logo-ac.png";
import "./Home.scss";
import DotGrid from "../DotGrid/DotGrid";

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
         <div style={{ width: "100%", height: "100%", position: "relative", overflow: "auto" }}>
            <DotGrid
              dotSize={3}
              gap={15}
              baseColor="#545454ff"
              activeColor="#00ffff"
              proximity={120}
              shockRadius={250}
              shockStrength={7}
              resistance={750}
              returnDuration={1.5}
            />
          </div>
      <div className="text-zone">
        <h1>
          Hi, <br />
          I'm Alexander Cartaya
          <br />
          Fullstack Software Developer
        </h1>
        <h2>React / Node / Docker / etc.</h2>
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
