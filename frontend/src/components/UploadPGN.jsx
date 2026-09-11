import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function UploadPGN({ onAnalysisComplete }) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, move: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!file) {
      setError("Please select a PGN file.");
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: 0, move: "" });
    setError("");

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
        `${API_URL}/analyze`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Analysis failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line);

          if (event.type === "progress") {
            setProgress(event);
          } else if (event.type === "error") {
            throw new Error(event.detail || "Analysis failed.");
          } else if (event.type === "complete") {
            onAnalysisComplete(event);
          }
        }

        if (done) break;
      }

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Could not connect to backend."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="upload-container">

      <div className="upload-card">

        <div className="upload-icon">
          ♟
        </div>

        <h2>Analyze Your Game</h2>

        <p>
          Upload a PGN file and let Stockfish
          analyze your game.
        </p>

        <form onSubmit={handleSubmit}>

          <label className="file-input">

            <input
              type="file"
              accept=".pgn"
              onChange={(event) => {
                setFile(event.target.files[0]);
                setError("");
              }}
            />

            <span>
              {file
                ? file.name
                : "Choose PGN file"}
            </span>

          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Analyze Game"}
          </button>

          {loading && (
            <div className="analysis-progress" aria-live="polite">
              <div className="progress-heading">
                <span>Analyzing move by move</span>
                <strong>
                  {progress.total
                    ? `${progress.current}/${progress.total}`
                    : "Preparing..."}
                </strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: progress.total
                      ? `${(progress.current / progress.total) * 100}%`
                      : "4%"
                  }}
                />
              </div>
              <small>
                {progress.move
                  ? `Evaluated ${progress.move}`
                  : "Starting Stockfish..."}
              </small>
            </div>
          )}

        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

      </div>

    </div>
  );
}

export default UploadPGN;