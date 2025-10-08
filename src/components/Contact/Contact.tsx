import { useEffect, useState } from "react";
import { PowerGlitch } from "powerglitch";
import "./Contact.scss";
import DotGrid from "../DotGrid/DotGrid";

function Contact() {
  const [result, setResult] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target as HTMLFormElement);

    formData.append("access_key", "033e1503-247c-4dd3-aceb-a7a0b68bf240");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      (event.target as HTMLFormElement).reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  useEffect(() => {
    PowerGlitch.glitch(".glitch-logo-sidebar", { timing: { iterations: 1 } });
    PowerGlitch.glitch(".glitch-hover", { playMode: "hover" });
  }, []);
  return (
    <div className="container contact-page">
      <div className="contact-dotgrid" aria-hidden="true">
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
        <h1>Contact Me</h1>
        <h2>
          Send me a message if you would like to talk or have project for me.
        </h2>

        {/*
          Example usage: set form `action` to https://formsubmit.co/you@example.com
          and include any hidden fields (e.g. _subject, _captcha=false) as needed.
        */}

        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Your name
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            Your email
            <input type="email" name="replyTo" placeholder="you@example.com" />
          </label>
          <label>
            Subject
            <input type="text" name="subject" placeholder="Subject" />
          </label>
          <label className="message">
            Message
            <textarea name="message" placeholder="Write your message here" />
          </label>
          <div className="form-actions">
            <button type="submit" className="flat-button glitch-hover">
              Send
            </button>
          </div>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
}

export default Contact;
