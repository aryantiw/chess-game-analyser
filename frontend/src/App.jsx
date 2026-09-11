import { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import UploadPGN from "./components/UploadPGN";
import MoveList from "./components/MoveList";
import AnalysisPanel from "./components/AnalysisPanel";
import "./App.css";

function App() {
  const [analysis, setAnalysis] = useState(null);

  // -1 = starting position
  // 0  = first move
  // 1  = second move
  // etc.
  const [selectedMove, setSelectedMove] = useState(-1);

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="brand-block">
            <div className="title-wrap">
              <h1>♟ Chess Analyzer</h1>
              <p className="tagline">
                {analysis
                  ? "PGN analysis powered by Stockfish 18"
                  : "PGN analysis via Stockfish 18"}
              </p>
            </div>
          </div>

          <div className="header-meta">
            <a
              className="contact-button"
              href="mailto:aryantiwar543@gmail.com"
              aria-label="Contact us"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        {!analysis ? (

          <UploadPGN
            onAnalysisComplete={(result) => {
              setAnalysis(result);
              setSelectedMove(-1);
            }}
          />

        ) : (

          <>
            {/* GAME INFORMATION */}

            <section className="game-info premium-card">
              <div className="game-summary-item">
                <span>White</span>
                <strong>{analysis.game.white}</strong>
              </div>

              <div className="game-summary-item highlight-item">
                <span>Black</span>
                <strong>{analysis.game.black}</strong>
              </div>

              <div className="game-summary-item">
                <span>Result</span>
                <strong>{analysis.game.result}</strong>
              </div>

              <div className="game-summary-item badge-item">
                <span>Moves</span>
                <strong>{analysis.total_moves}</strong>
              </div>
            </section>


            {/* ANALYSIS AREA */}

            <div className="analysis-layout">

              {/* CHESS BOARD */}

              <div className="board-section premium-card">
                <div className="section-heading">
                  <span className="section-kicker">Board</span>
                  <h2>Position Review</h2>
                </div>

                <ChessBoard
                  analysis={analysis.analysis}
                  selectedMove={selectedMove}
                  onMoveChange={setSelectedMove}
                />

              </div>


              {/* RIGHT PANEL */}

              <aside className="side-panel premium-card">
                <AnalysisPanel
                  analysis={analysis.analysis}
                  selectedMove={selectedMove}
                />

                <MoveList
                  moves={analysis.analysis}
                  selectedMove={selectedMove}
                  onMoveSelect={setSelectedMove}
                />
              </aside>

            </div>


            {/* NEW GAME */}

            <button
              className="new-game-button"
              onClick={() => {
                setAnalysis(null);
                setSelectedMove(-1);
              }}
            >
              Analyze Another Game
            </button>

          </>

        )}

      </main>

    </div>
  );
}

export default App;