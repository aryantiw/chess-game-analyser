import { Chessboard } from "react-chessboard";

function ChessBoard({
  analysis = [],
  selectedMove = -1,
  onMoveChange = () => {}
}) {

  // Starting position
  const startingFen =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  // Get current FEN
  const currentFen =
    selectedMove >= 0 &&
    analysis[selectedMove]?.fen
      ? analysis[selectedMove].fen
      : startingFen;

  const currentMove =
    selectedMove >= 0
      ? analysis[selectedMove]
      : null;


  // ============================================
  // PREVIOUS
  // ============================================

  const goPrevious = () => {

    if (selectedMove > -1) {
      onMoveChange(selectedMove - 1);
    }

  };


  // ============================================
  // NEXT
  // ============================================

  const goNext = () => {

    if (selectedMove < analysis.length - 1) {
      onMoveChange(selectedMove + 1);
    }

  };


  return (
    <div className="board-wrapper">

      <div className="board-shell">
        <div className="board-topbar">
          <span className="board-label">Live Board</span>
          <span className="board-status">
            {currentMove ? "Position synced" : "Opening position"}
          </span>
        </div>

        {/* BOARD */}

        <div className="board-container">
          <div className="board-frame">
            <Chessboard
              options={{
                position: currentFen,
                boardWidth: 590,
                allowDragging: false,
                showBoardNotation: true,
                customDarkSquareStyle: {
                  backgroundColor: "#1f3b66"
                },
                customLightSquareStyle: {
                  backgroundColor: "#dfeaff"
                },
                customBoardStyle: {
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 18px 30px rgba(17, 23, 38, 0.2)"
                }
              }}
            />
          </div>
        </div>

        {/* CURRENT MOVE */}

        <div className="current-move premium-box">

          {currentMove ? (

            <>
              <span>
                {currentMove.color === "White"
                  ? `${currentMove.move_number}.`
                  : `${currentMove.move_number}...`
                }
              </span>

              <strong>
                {currentMove.played}
              </strong>
            </>

          ) : (

            <span>
              Starting Position
            </span>

          )}

        </div>
      </div>


      {/* CONTROLS */}

      <div className="board-controls">

        <button
          onClick={goPrevious}
          disabled={selectedMove <= -1}
        >
          ◀ Previous
        </button>


        <span className="move-counter">
          {selectedMove + 1} / {analysis.length}
        </span>


        <button
          onClick={goNext}
          disabled={
            selectedMove >= analysis.length - 1
          }
        >
          Next ▶
        </button>

      </div>

    </div>
  );
}

export default ChessBoard;