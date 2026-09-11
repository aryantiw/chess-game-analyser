import chess
import chess.pgn
import chess.engine
import os


# ============================================================
# STOCKFISH CONFIGURATION
# ============================================================

STOCKFISH_PATH = os.getenv(
    "STOCKFISH_PATH",
    os.path.join(
        os.path.dirname(__file__),
        "stockfish",
        "stockfish-windows-x86-64-avx2.exe"
    )
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def score_to_cp(score):
    """
    Convert Stockfish score to centipawns.

    Example:
        +1.50 -> 150
        -0.80 -> -80
    """

    if score.is_mate():

        mate = score.mate()

        if mate is None:
            return 0

        return 100000 if mate > 0 else -100000

    return score.score()


def classify_move(
    eval_before,
    eval_after,
    player_color
):
    """
    Classify a move based on evaluation loss.

    Evaluations are always from White's perspective.
    """

    if player_color == chess.WHITE:
        loss = eval_before - eval_after

    else:
        loss = eval_after - eval_before

    loss_pawns = loss / 100

    if loss_pawns < 0.20:
        classification = "Good"

    elif loss_pawns < 0.50:
        classification = "Inaccuracy"

    elif loss_pawns < 1.00:
        classification = "Mistake"

    else:
        classification = "Blunder"

    return classification, round(
        max(0, loss_pawns),
        2
    )


# ============================================================
# GAME ANALYZER
# ============================================================

def analyze_game(
    pgn_file,
    depth=12,
    progress_callback=None
):

    # --------------------------------------------------------
    # Check Stockfish
    # --------------------------------------------------------

    if not os.path.exists(STOCKFISH_PATH):

        raise FileNotFoundError(
            f"Stockfish not found at: {STOCKFISH_PATH}"
        )

    # --------------------------------------------------------
    # Read PGN
    # --------------------------------------------------------

    game = chess.pgn.read_game(pgn_file)

    if game is None:

        raise ValueError(
            "Could not read PGN file."
        )

    # --------------------------------------------------------
    # Start Stockfish
    # --------------------------------------------------------

    engine = chess.engine.SimpleEngine.popen_uci(
        STOCKFISH_PATH
    )

    # --------------------------------------------------------
    # Configure Stockfish
    # --------------------------------------------------------

    try:

        engine.configure({
            "Threads": 6,
            "Hash": 256
        })

    except Exception as error:

        print(
            "Could not configure Stockfish:",
            error
        )

    # --------------------------------------------------------
    # Board
    # --------------------------------------------------------

    board = game.board()

    results = []

    # Get all moves first
    moves = list(game.mainline_moves())

    total_moves = len(moves)

    print(
        f"Starting analysis of {total_moves} moves..."
    )

    try:

        # ====================================================
        # MOVE LOOP
        # ====================================================

        for ply, move in enumerate(
            moves,
            start=1
        ):

            # ------------------------------------------------
            # Progress
            # ------------------------------------------------

            print(
                f"Analyzing move {ply}/{total_moves}"
            )

            # ------------------------------------------------
            # Position BEFORE move
            # ------------------------------------------------

            before = board.copy()

            player_color = board.turn

            move_number = board.fullmove_number

            # SAN before pushing
            san_move = board.san(move)

            # ------------------------------------------------
            # Stockfish BEFORE
            # ------------------------------------------------

            analysis_before = engine.analyse(
                before,
                chess.engine.Limit(
                    depth=depth
                )
            )

            best_move = analysis_before["pv"][0]

            score_before = (
                analysis_before["score"]
                .pov(chess.WHITE)
            )

            eval_before = score_to_cp(
                score_before
            )

            best_move_san = before.san(
                best_move
            )

            # ------------------------------------------------
            # PLAY ACTUAL MOVE
            # ------------------------------------------------

            board.push(move)

            # ------------------------------------------------
            # Stockfish AFTER
            # ------------------------------------------------

            analysis_after = engine.analyse(
                board,
                chess.engine.Limit(
                    depth=depth
                )
            )

            score_after = (
                analysis_after["score"]
                .pov(chess.WHITE)
            )

            eval_after = score_to_cp(
                score_after
            )

            # ------------------------------------------------
            # CLASSIFICATION
            # ------------------------------------------------

            classification, evaluation_loss = (
                classify_move(
                    eval_before,
                    eval_after,
                    player_color
                )
            )

            # ------------------------------------------------
            # RESULT
            # ------------------------------------------------

            result = {

                "ply": ply,

                "move_number": move_number,

                "color": (
                    "White"
                    if player_color == chess.WHITE
                    else "Black"
                ),

                "played": san_move,

                "best_move": best_move_san,

                "evaluation_before": round(
                    eval_before / 100,
                    2
                ),

                "evaluation_after": round(
                    eval_after / 100,
                    2
                ),

                "evaluation_loss": (
                    evaluation_loss
                ),

                "classification": (
                    classification
                ),

                "fen": board.fen()
            }

            results.append(result)

            if progress_callback:
                progress_callback(
                    ply,
                    total_moves,
                    san_move
                )

    finally:

        engine.quit()

    print(
        "Analysis completed."
    )

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "game": {

            "white": game.headers.get(
                "White",
                "Unknown"
            ),

            "black": game.headers.get(
                "Black",
                "Unknown"
            ),

            "result": game.headers.get(
                "Result",
                "*"
            ),

            "date": game.headers.get(
                "Date",
                ""
            ),

            "event": game.headers.get(
                "Event",
                ""
            )
        },

        "total_moves": total_moves,

        "analysis": results
    }