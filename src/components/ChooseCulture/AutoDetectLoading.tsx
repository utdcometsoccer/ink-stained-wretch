export function AutoDetectLoading() {
  return (
    <div className="choose-culture-container">
      <div className="auto-detection">
        <h1>Welcome to Ink Stained Wretch</h1>
        <div className="detection-spinner">
          <div className="spinner"></div>
          <p>Detecting your language and region...</p>
        </div>
      </div>
    </div>
  );
}