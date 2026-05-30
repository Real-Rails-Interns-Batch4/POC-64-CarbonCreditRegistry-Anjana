from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Carbon Credit Registry Explorer API")

# Enable CORS for Next.js frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "poc": 64, "title": "Carbon Credit Registry Explorer"}

@app.get("/api/projects")
def get_projects():
    # Base fallback structured data to supply your map and dashboard
    return [
        {
            "id": "VCS-934",
            "name": "Rimba Raya Biodiversity Reserve Project",
            "registry": "Verra",
            "methodology": "VM0007",
            "status": "Registered",
            "country": "Indonesia",
            "latitude": -2.712,
            "longitude": 112.441,
            "issuances": 3500000,
            "retirements": 1200000
        },
        {
            "id": "GS-4152",
            "name": "Safe Water Access Clean Cookstoves",
            "registry": "Gold Standard",
            "methodology": "GS-TPDDL-v2.2",
            "status": "Certified",
            "country": "Rwanda",
            "latitude": -1.940,
            "longitude": 29.873,
            "issuances": 850000,
            "retirements": 430000
        }
    ]
