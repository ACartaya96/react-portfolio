import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faHome,
  faUser,
  faEnvelope,
  faCode,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import { useEffect } from "react";
import LogoAC from "../../assets/images/logo-ac.png";
import "./Sidebar.scss";

const Sidebar = () => {
  useEffect(() => {
    PowerGlitch.glitch(".glitch-logo-sidebar", { timing: { iterations: 1 } });
    PowerGlitch.glitch(".glitch-hover", { playMode: "hover" });
  }, []);
  return (
    <div className="nav-bar">
      <Link className="logo glitch-logo-sidebar glitch-hover" to="/">
        <img src={LogoAC} alt="logo" />
      </Link>
      <nav>
        <NavLink
          className={({ isActive }) =>
            isActive ? "active-link glitch-hover" : "inactive-link glitch-hover"
          }
          to="/"
        >
          <FontAwesomeIcon icon={faHome} color="4d4d4e" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "active-link about-link glitch-hover"
              : "inactive-link about-link glitch-hover"
          }
          to="/about"
        >
          <FontAwesomeIcon icon={faUser} color="4d4d4e" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "active-link contact-link glitch-hover"
              : "inactive-link contact-link glitch-hover"
          }
          to="/contact"
        >
          <FontAwesomeIcon icon={faEnvelope} color="4d4d4e" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "active-link softdev-link glitch-hover"
              : "inactive-link softdev-link glitch-hover"
          }
          to="/cs-projects"
        >
          <FontAwesomeIcon icon={faCode} color="4d4d4e" />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "active-link gamedev-link glitch-hover"
              : "inactive-link gamedev-link glitch-hover"
          }
          to="/gd-projects"
        >
          <FontAwesomeIcon icon={faGamepad} color="4d4d4e" />
        </NavLink>
      </nav>
      <ul>
        <li>
          <a
            className="glitch-hover"
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/alexandercartaya/"
          >
            <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            className="glitch-hover git"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/ACartaya96"
          >
            <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
          </a>
        </li>
        <li>
          <a
            className="glitch-hover wa"
            target="_blank"
            rel="noreferrer"
            href="https://wa.me/13058070352"
          >
            <FontAwesomeIcon icon={faWhatsapp} color="#4d4d4e" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
