from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (Allow requests from React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
models = [
    joblib.load("logistic_model.pkl"),
    joblib.load("svm_model.pkl"),
    joblib.load("xgb_model.pkl")
]

model_names = ["Logistic Regression", "SVM", "XGBoost"]

# Define input format
class InputData(BaseModel):
    features: list

@app.post("/predict/{model_index}")
async def predict(model_index: int, data: InputData):
    if model_index < 0 or model_index >= len(models):
        return {"error": "Invalid model index"}

    model = models[model_index]
    features_array = np.array(data.features).reshape(1, -1)  # Convert list to NumPy array

    # Get prediction probabilities
    probability = model.predict_proba(features_array)[0][1]

    return {
        "model": model_names[model_index],
        "prediction_probability": round(probability, 4)
    }

