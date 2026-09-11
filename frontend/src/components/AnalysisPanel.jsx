function AnalysisPanel({
  analysis = [],
  selectedMove = -1
}) {

  // Starting position
  if (
    selectedMove < 0 ||
    !analysis[selectedMove]
  ) {

    return (
      <div className="analysis-panel">

        <div className="analysis-header">
          <h2>Move Analysis</h2>
        </div>

        <div className="starting-position">

          <div className="starting-icon">
            ♟
          </div>

          <h3>Starting Position</h3>

          <p>
            Select a move to see its Stockfish analysis.
          </p>

        </div>

      </div>
    );
  }


  const move = analysis[selectedMove];


  return (
    <div className="analysis-panel">

      {/* HEADER */}

      <div className="analysis-header">

        <div>
          <span className="section-kicker">Analysis</span>
          <h2>Move Analysis</h2>
        </div>

        <span className="move-number">

          {move.color === "White"
            ? `${move.move_number}.`
            : `${move.move_number}...`
          }

          {" "}

          {move.played}

        </span>

      </div>


      {/* PLAYED MOVE */}

      <div className="analysis-section">

        <span className="label">
          Played
        </span>

        <strong className="played-move">
          {move.played}
        </strong>

      </div>


      {/* BEST MOVE */}

      <div className="analysis-section">

        <span className="label">
          Best Move
        </span>

        <strong className="best-move">
          {move.best_move}
        </strong>

      </div>


      {/* EVALUATION */}

      <div className="evaluation-grid">

        <div className="evaluation-card">

          <span>
            Before
          </span>

          <strong>
            {formatEvaluation(
              move.evaluation_before
            )}
          </strong>

        </div>


        <div className="evaluation-card">

          <span>
            After
          </span>

          <strong>
            {formatEvaluation(
              move.evaluation_after
            )}
          </strong>

        </div>

      </div>


      {/* CLASSIFICATION */}

      <div
        className={`classification ${getClassificationClass(
          move.classification
        )}`}
      >

        <span>
          {getClassificationIcon(
            move.classification
          )}
        </span>

        <div>

          <strong>
            {move.classification}
          </strong>

          <small>
            Evaluation loss:{" "}
            {move.evaluation_loss}
          </small>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   HELPERS
============================================================ */

function formatEvaluation(value) {

  if (value === null || value === undefined) {
    return "0.00";
  }

  if (Math.abs(value) >= 1000) {

    return value > 0
      ? "+M"
      : "-M";
  }

  return value > 0
    ? `+${Number(value).toFixed(2)}`
    : Number(value).toFixed(2);
}


function getClassificationClass(
  classification
) {

  switch (classification) {

    case "Good":
      return "good";

    case "Inaccuracy":
      return "inaccuracy";

    case "Mistake":
      return "mistake";

    case "Blunder":
      return "blunder";

    default:
      return "";
  }
}


function getClassificationIcon(
  classification
) {

  switch (classification) {

    case "Good":
      return "✓";

    case "Inaccuracy":
      return "?!";

    case "Mistake":
      return "?";

    case "Blunder":
      return "??";

    default:
      return "";
  }
}


export default AnalysisPanel;