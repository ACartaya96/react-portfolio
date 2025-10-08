function LoadingBar() {
  // Reuse the .image-loading and .loading-bar styles from ProjectEmbed.scss
  return (
    <div className="image-loading" aria-hidden="true">
      <div className="loading-bar" />
    </div>
  );
}

export default LoadingBar;
