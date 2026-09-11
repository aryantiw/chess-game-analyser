import chess
import chess.engine
import os

STOCKFISH_PATH = os.path.join(
    os.path.dirname(__file__),
    "stockfish",
    "stockfish-windows-x86-64-avx2.exe"
)

print("Stockfish path:")
print(STOCKFISH_PATH)

print("\nStarting Stockfish...")

engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)

board = chess.Board()

result = engine.analyse(
    board,
    chess.engine.Limit(depth=15)
)

print("\nBest move:", board.san(result["pv"][0]))
print("Evaluation:", result["score"].pov(board.turn))
print("Depth:", result["depth"])

engine.quit()

print("\nStockfish test successful!")