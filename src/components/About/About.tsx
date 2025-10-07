import MePhoto from "../../assets/images/me-photo.jpg";
import { PowerGlitch } from "powerglitch";
import { useEffect } from "react";
import "./About.scss";
import DotGrid from "../DotGrid/DotGrid";

function About() {
  useEffect(() => {
    PowerGlitch.glitch(".glitch-about", { timing: { iterations: 1 } });
  }, []);
  return (
    <div className="container about-page">
      <div className="about-dotgrid" aria-hidden="true">
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#6e6e6eff"
          activeColor="#00ffff"
          proximity={120}
          shockRadius={250}
          shockStrength={7}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="profile-container">
        <img className="glitch-about" src={MePhoto} alt="Me" />
        <div className="text-zone">
          <h1>About Me</h1>
          <p>
            {" "}
            I am a Full Stack Developer who looks for any opportunity to grow my
            skills in Computer Science. I am familiar with a plethora of
            languages, and systems from frameworks like React or even DevOp
            tools such as Perforce, and other version controls.
          </p>
          <p>
            {" "}
            I am also an avid gamer and game developer who have worked on
            multiple small projects built from either events like school
            project, game jams, or just personal interest and curiosity
          </p>
          <p>
            {" "}
            If I could describe myself in one sentence I am a hard working
            individual, who loves his friends and family,and is constantly
            curious about how the world works.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
