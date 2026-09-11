# Chess Analyzer

A modern chess analysis app that uploads a PGN file and uses Stockfish to evaluate each move in the game.

## Features

- Upload PGN files
- Analyze full games with Stockfish
- Review board positions move-by-move
- See best move, evaluation before/after, and move classification
- Premium modern UI with responsive layout

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Chess engine: Stockfish
- Chess library: python-chess

## Project Structure

```bash
chess-anal/
├── backend/
│   ├── analyzer.py
│   ├── main.py
│   ├── requirements.txt
│   └── stockfish/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── .gitignore
```

## Backend Setup

From the backend folder:

```bash
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Then open:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

From the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Stockfish setup

The Stockfish executable is not committed because GitHub rejects individual files larger than 100 MB.

1. Download the Windows Stockfish build from the [official Stockfish site](https://stockfishchess.org/download/).
2. Put the executable at `backend/stockfish/stockfish-windows-x86-64-avx2.exe`, or set `STOCKFISH_PATH` to its location.

PowerShell example:

```powershell
$env:STOCKFISH_PATH = "C:\path\to\stockfish.exe"
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend expects a PGN file upload through the `/analyze` endpoint. The app is built for local development and demonstration.

## Contact

For questions or feedback, contact:

```text
aryantiwar543@gmail.com
```
