
import DotGrid from "../DotGrid/DotGrid";
import ProjectEmbed from "../ProjectEmbed/ProjectEmbed";
import "./SoftDev.scss";

function SoftDev() {
  return (
    <div className=" container softdev-page">
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
      <h1>SoftDev Projects</h1>
      <div className="project-container">
          <ProjectEmbed
            src="https://fullstack-developer-capstone-1.onrender.com"
            title="Fullstack Capstone Project"
            description="A fullstack car dealership web application built with React, Node.js, Express, and MongoDB. Features include user authentication, car inventory management, and a responsive design."
            contributions="Fullstack Development, UI/UX Design, Database Management"
            work="This was my capstone project for the Fullstack Developer certification by IBM. Implemented user authentication, car inventory management, and responsive design using React for the frontend and Node.js with Express for the backend. Managed data storage with MongoDB."
            fallbackImage={new URL("../../assets/images/dealership_capstone.png", import.meta.url).href}
          />
          <ProjectEmbed
            src="https://acartaya96.github.io/react-portfolio/"
            title="React Portfolio"
            contributions="Frontend Development, UI/UX Design"
            description="A personal portfolio website built with React to showcase my projects and skills as a software developer. Features include responsive design, animated transitions, and project embeds."
            work="This is my personal portfolio website built using React. It showcases my projects, skills, and experience as a software developer. The site features a responsive design, animated transitions, and project embeds using iframes."
            fallbackImage={new URL("../../assets/images/react-portfolio.png", import.meta.url).href}
          />
      </div>
    </div>
  );
}

export default SoftDev;
