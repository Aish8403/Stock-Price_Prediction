import React, { useState } from "react";
import axios from "axios";

function App() {
  const [features, setFeatures] = useState("");
  const [selectedModel, setSelectedModel] = useState(0);
  const [prediction, setPrediction] = useState(null);

  const models = ["Logistic Regression", "SVM", "XGBoost"];

  const handleFeatureChange = (event) => {
    setFeatures(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handlePredict = async () => {
    if (!features) {
      alert("Please enter feature values!");
      return;
    }

    const featureArray = features.split(",").map(Number); // Convert input to array

    try {
      const response = await axios.post(
        `http://localhost:8000/predict/${selectedModel}`,
        { features: featureArray }
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Error getting prediction");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>ML Model Prediction</h1>
      <div>
        <label>Enter Features (comma-separated): </label>
        <input
          type="text"
          value={features}
          onChange={handleFeatureChange}
          placeholder="e.g., 0.5, 1.2, 3.4, 5.6"
          style={{ width: "250px", margin: "10px" }}
        />
      </div>
      <div>
        <label>Select Model: </label>
        <select value={selectedModel} onChange={handleModelChange}>
          {models.map((model, index) => (
            <option key={index} value={index}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handlePredict} style={{ marginTop: "10px" }}>
        Predict
      </button>
      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h2>Prediction Result</h2>
          <p><b>Model:</b> {prediction.model}</p>
          <p><b>Prediction Probability:</b> {prediction.prediction_probability.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
