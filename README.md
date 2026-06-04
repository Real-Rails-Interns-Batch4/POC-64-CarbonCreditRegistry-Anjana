# POC-64: Carbon Credit Registry Explorer

A high-performance real-time data terminal mapping voluntary carbon registry asset supply ledgers (Verra and Gold Standard) across a global vector viewport plane. Built for the Real Rails Intelligence Library.

## 🛠️ Technical Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS (v4)
- **Mapping Engine**: MapLibre GL JS (CartoDB Dark Matter Vector Tiles)
- **Backend API**: Python FastAPI, Uvicorn
- **Iconography**: Lucide React

## 📐 Architecture & Layout Protocol
Following the structural DNA constraints of the Real Rails framework, this project implements:
1. **Obsidian Interface**: Complete visual alignment utilizing an Obsidian Black background and Deep Navy Grey data surfaces.
2. **2-Column Split Stage**:
   - **Main Stage (70% Width)**: Interactive full-viewport geographic coordinate projection mapping live data nodes.
   - **Intelligence Sidebar (30% Width)**: Houses high-level metrics, physical infrastructure context, dynamic filtering states, and asset ledger data stream rows.

## 🚀 Quick Start & Installation

### 1. Run the Backend API
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload
```
### 1. Run the Frontend UI Terminal
Open a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser to http://localhost:3000 to interact with the system terminal.