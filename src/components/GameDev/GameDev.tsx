import DotGrid from "../DotGrid/DotGrid";
import ProjectEmbed from "../ProjectEmbed/ProjectEmbed";
import "./GameDev.scss";

function GameDev() {
  return (
    <div className="container gamedev-page">
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
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
      <h1>GameDev Projects</h1>
      <div className="project-container">
        <ProjectEmbed
          src="https://acartaya96.itch.io/the-apprentice-knight"
          title="The Apprentice Knight"
          description="The Apprentice Knight is an all-new souls-like adventure platformer where you take the young wizard apprentice Xander on a perilous adventure through the misty swamp, climb the steep cliff faces of Natsuevil Mountain, and enter the domain of Ramuh the Evil Sorcerer."
          contributions="Gameplay programming, DevTools programming, Level Design, and Game Design. "
          work="Worked on this one month project as the lead gameplay programmer and devtools programmer on a team of 6 people. Used Unity and C# to implement game mechanics, player controls. Designed the central level hub, and water shaders. Also created custom magic system tools to improve team workflow for designing and creating spells."
          fallbackImage={
            new URL(
              "../../assets/images/the_apprentice_knight.png",
              import.meta.url
            ).href
          }
          useEmbed={true}
        />

        <ProjectEmbed
          src="https://digi-knight.itch.io/phobiaphobia"
          title="Phobophobia"
          description="Phobophobia is a psychological horror game that explores the fears and anxieties of its protagonist, who must navigate a dark and twisted world filled with terrifying creatures and unsettling environments."
          contributions="Gameplay programming"
          work="Worked on this 3 day project as the lead gameplay programmer. Used Unity and C# to implement game mechanics, player controls, and environmental interactions."
          fallbackImage={
            new URL("../../assets/images/Phobophobia.png", import.meta.url).href
          }
          useEmbed={true}
        />
      </div>
    </div>
  );
}

export default GameDev;
