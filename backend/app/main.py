from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Carbon Credit Registry Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "poc": 64}

@app.get("/api/projects")
def get_projects():
    return [
        {
            "id": "VCS-934",
            "name": "Rimba Raya Biodiversity Reserve Project",
            "registry": "Verra",
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
            "status": "Certified",
            "country": "Rwanda",
            "latitude": -1.940,
            "longitude": 29.873,
            "issuances": 850000,
            "retirements": 430000
        },
        {
            "id": "VCS-1221",
            "name": "Amazon Basin Avoided Deforestation",
            "registry": "Verra",
            "status": "Registered",
            "country": "Brazil",
            "latitude": -3.465,
            "longitude": -62.215,
            "issuances": 2100000,
            "retirements": 950000
        },
        {
            "id": "GS-2981",
            "name": "Wind Power Generation Grid Asset",
            "registry": "Gold Standard",
            "status": "Certified",
            "country": "India",
            "latitude": 20.593,
            "longitude": 78.962,
            "issuances": 1300000,
            "retirements": 610000
        },
        {
            "id": "VCS-2409",
            "name": "Borehole Clean Water Infrastructure",
            "registry": "Verra",
            "status": "Registered",
            "country": "Malawi",
            "latitude": -13.254,
            "longitude": 34.301,
            "issuances": 640000,
            "retirements": 210000
        },
        {
            "id": "GS-884",
            "name": "Methane Capture & Thermal Energy",
            "registry": "Gold Standard",
            "status": "Certified",
            "country": "Mexico",
            "latitude": 23.634,
            "longitude": -102.552,
            "issuances": 920000,
            "retirements": 400000
        },
        {
            "id": "VCS-712",
            "name": "Improved Cookstoves Distribution Framework",
            "registry": "Verra",
            "status": "Registered",
            "country": "Kenya",
            "latitude": -0.023,
            "longitude": 37.906,
            "issuances": 1150000,
            "retirements": 530000
        }
    ]