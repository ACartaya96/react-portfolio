import React, { useEffect, useRef, useState } from "react";
import "./ProjectEmbed.scss";
import LoadingBar from "./LoadingBar/LoadingBar";

type ProjectEmbedProps = {
  src: string;
  title?: string;
  contributions?: string;
  work?: string;
  description?: string;
  timeoutMs?: number;
  fallbackImage?: string; // absolute or import.meta.url-resolved path
  useEmbed?: boolean; // if false, always show fallback image instead of attempting embed
  className?: string;
};

const ProjectEmbed: React.FC<ProjectEmbedProps> = ({
  src,
  title,
  contributions,
  description,
  work,
  timeoutMs = 6000,
  fallbackImage,
  useEmbed = true,
  className = "",
}) => {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // reset to loading state whenever src or timeoutMs changes
    setLoaded(null);
    setImageLoaded(null);

    // start timeout to mark as failed if not loaded in time
    timeoutRef.current = window.setTimeout(() => {
      setLoaded((cur) => (cur === null ? false : cur));
    }, timeoutMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [src, timeoutMs]);

  function handleLoad() {
    // onLoad may fire even if the site is blocked from being framed.
    // Try to inspect the frame's document; if it's empty/null, treat as failed.
    try {
      const iframeEl = iframeRef.current;
      const doc = iframeEl?.contentDocument;

      if (!doc || !doc.body || doc.body.children.length === 0) {
        // empty / likely blocked
        setLoaded(false);
      } else {
        setLoaded(true);
      }
    } catch (err) {
      // Accessing contentDocument can throw for cross-origin framed pages.
      // If it throws, we can't verify, so assume the iframe loaded successfully.
      setLoaded(true);
    } finally {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }

  function handleError() {
    setLoaded(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  // choose fallback asset; if none provided, use a default placeholder in assets
  const fallbackSrc =
    fallbackImage ??
    new URL("../../assets/images/softdev-fallback.svg", import.meta.url).href;
  // reset image loaded state when fallback changes or embedding mode changes
  useEffect(() => {
    setImageLoaded(null);
  }, [fallbackSrc, useEmbed]);
  // If caller explicitly disables embedding, always render the fallback image/link
  if (!useEmbed) {
    return (
      <div className={`project-embed ${className}`}>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="iframe-fallback"
        >
          {/* show loading placeholder while image is being fetched */}
          {imageLoaded !== true ? <LoadingBar /> : null}
          <img
            src={fallbackSrc}
            alt={`${title ?? "Project"} (open in new tab)`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            style={{ display: imageLoaded === true ? undefined : "none" }}
          />
        </a>
        {title || description ? (
          <div className="embed-info">
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`project-embed ${className}`}>
      {loaded === false ? (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="iframe-fallback"
        >
          {imageLoaded !== true ? <LoadingBar /> : null}
          <img
            src={fallbackSrc}
            alt={`${title ?? "Project"} (open in new tab)`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            style={{ display: imageLoaded === true ? undefined : "none" }}
          />
        </a>
      ) : loaded === null ? (
        // show the loading bar while iframe is pending; the LoadingBar
        // will stay visible until handleLoad sets loaded=true or timeout sets loaded=false
        <LoadingBar />
      ) : (
        <iframe
          ref={(el) => {
            iframeRef.current = el;
          }}
          title={title ?? "Project embed"}
          src={src}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {title || description ? (
        <div className="embed-info">
          {title && <h3>{title}</h3>}
          {contributions && <p>{contributions}</p>}
          {description && <p>{description}</p>}
          {work && <p>{work}</p>}
        </div>
      ) : null}
    </div>
  );
};

export default ProjectEmbed;
