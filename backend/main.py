from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(
    title="AgriPredict API",
    description="AI-Powered Fertilizer Recommendation System",
    version="1.0.0"
)

# --- Configuration ---
# Allow all origins for dev; restrict in prod
ORIGINS = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Paths & Artifacts ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'model_artifacts')

class ModelService:
    def __init__(self):
        self.model = None
        self.le_soil = None
        self.le_crop = None
        self.le_fertilizer = None
        self.metadata = None
        self.load_artifacts()

    def load_artifacts(self):
        try:
            print(f"Loading artifacts from {ARTIFACTS_DIR}...")
            self.model = joblib.load(os.path.join(ARTIFACTS_DIR, 'rf_model.pkl'))
            self.le_soil = joblib.load(os.path.join(ARTIFACTS_DIR, 'le_soil.pkl'))
            self.le_crop = joblib.load(os.path.join(ARTIFACTS_DIR, 'le_crop.pkl'))
            self.le_fertilizer = joblib.load(os.path.join(ARTIFACTS_DIR, 'le_fertilizer.pkl'))
            self.metadata = joblib.load(os.path.join(ARTIFACTS_DIR, 'metadata.pkl'))
            print("Artifacts loaded successfully.")
        except FileNotFoundError as e:
            print(f"CRITICAL: Artifacts not found. {e}")
        except Exception as e:
            print(f"CRITICAL: Error loading artifacts. {e}")

    def predict(self, data):
        if not self.model:
            raise HTTPException(status_code=503, detail="Model service unavailable")

        try:
            # Encode Categorical
            try:
                soil_encoded = self.le_soil.transform([data.soil_type])[0]
                crop_encoded = self.le_crop.transform([data.crop_type])[0]
            except ValueError:
                # Fallback or strict error? Let's give a clear error
                valid_soils = ", ".join(self.metadata.get('soil_types', []))
                valid_crops = ", ".join(self.metadata.get('crop_types', []))
                raise ValueError(f"Invalid category. Valid Soils: [{valid_soils}]. Valid Crops: [{valid_crops}]")

            # Create DF
            input_df = pd.DataFrame([[
                data.temperature, data.humidity, data.moisture,
                soil_encoded, crop_encoded,
                data.nitrogen, data.potassium, data.phosphorous
            ]], columns=[
                'Temparature', 'Humidity', 'Moisture', 'Soil_Type',
                'Crop_Type', 'Nitrogen', 'Potassium', 'Phosphorous'
            ])

            # Predict
            pred_idx = self.model.predict(input_df)[0]
            result = self.le_fertilizer.inverse_transform([pred_idx])[0]
            return result

        except ValueError as ve:
             raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Initialize Service
service = ModelService()

# --- Schemas ---
class PredictionRequest(BaseModel):
    temperature: float = Field(..., ge=-50, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    moisture: float = Field(..., ge=0, le=100, description="Soil moisture")
    soil_type: str
    crop_type: str
    nitrogen: float = Field(..., ge=0, description="Nitrogen content")
    potassium: float = Field(..., ge=0, description="Potassium content")
    phosphorous: float = Field(..., ge=0, description="Phosphorous content")

# --- Endpoints ---
@app.get("/")
def health_check():
    return {"status": "online", "model_loaded": service.model is not None}

@app.get("/metadata")
def get_metadata():
    if not service.metadata:
        raise HTTPException(status_code=503, detail="Metadata unavailable")
    return service.metadata

@app.post("/predict")
def predict_fertilizer(request: PredictionRequest):
    result = service.predict(request)
    return {"predicted_fertilizer": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
