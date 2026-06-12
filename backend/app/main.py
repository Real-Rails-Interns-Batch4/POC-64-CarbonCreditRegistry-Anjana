from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Carbon Credit Registry API Pipeline")

# Enable cross-origin requests so your Next.js dashboard can fetch data cleanly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicitly map the path to the newly generated data storage file
DATA_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "projects.json")

@app.get("/api/projects")
def get_parsed_projects():
    if not os.path.exists(DATA_FILE_PATH):
        print(f"⚠️ Data path target missing at lookup: {DATA_FILE_PATH}")
        return []
    
    try:
        # Open and return the dynamic data entries using explicit UTF-8 decoding
        with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        print(f"CRITICAL API RECOVERY ERROR: {e}")
        return []