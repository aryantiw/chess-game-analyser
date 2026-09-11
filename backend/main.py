from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from analyzer import analyze_game

import io
import json
import asyncio
import queue


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Chess Analyzer",
    description="Chess game analyzer powered by Stockfish 18",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "status": "running",
        "message": "Chess Analyzer API is running!",
        "engine": "Stockfish 18"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# ANALYZE PGN
# ============================================================

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided."
        )

    if not file.filename.lower().endswith(".pgn"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a .pgn file."
        )

    try:
        contents = await file.read()
        contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="PGN file must be UTF-8 encoded."
        )

    async def analysis_stream():
        events = queue.Queue()

        def on_progress(ply, total_moves, move):
            events.put({
                "type": "progress",
                "current": ply,
                "total": total_moves,
                "move": move
            })

        def run_analysis():
            try:
                result = analyze_game(
                    io.StringIO(contents.decode("utf-8")),
                    depth=12,
                    progress_callback=on_progress
                )
                events.put({
                    "type": "complete",
                    "success": True,
                    "filename": file.filename,
                    **result
                })
            except ValueError as error:
                events.put({"type": "error", "detail": str(error)})
            except FileNotFoundError as error:
                events.put({"type": "error", "detail": str(error)})
            except Exception as error:
                print("Analysis error:", error)
                events.put({
                    "type": "error",
                    "detail": "An error occurred while analyzing the game."
                })
            finally:
                events.put(None)

        analysis_task = asyncio.create_task(
            asyncio.to_thread(run_analysis)
        )

        while True:
            event = await asyncio.to_thread(events.get)
            if event is None:
                break
            yield json.dumps(event) + "\n"

        await analysis_task

    return StreamingResponse(
        analysis_stream(),
        media_type="application/x-ndjson"
    )