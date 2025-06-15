from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model, scaler and column order
param_models = {
    "pH": {
        "model": joblib.load("trained_models/Stacking_pH.pkl"),
        "scaler": joblib.load("trained_models/scaler_Stacking_pH.pkl"),
        "features": joblib.load("trained_models/features_Stacking_pH.pkl")
    },
    "Turbidity": {
        "model": joblib.load("trained_models/Stacking_Turbidity.pkl"),
        "scaler": joblib.load("trained_models/scaler_Stacking_Turbidity.pkl"),
        "features": joblib.load("trained_models/features_Stacking_Turbidity.pkl")
    },
    "TDS": {
        "model": joblib.load("trained_models/Stacking_TDS.pkl"),
        "scaler": joblib.load("trained_models/scaler_Stacking_TDS.pkl"),
        "features": joblib.load("trained_models/features_Stacking_TDS.pkl")
    },
    "Temperature": {
        "model": joblib.load("trained_models/Stacking_Temperature.pkl"),
        "scaler": joblib.load("trained_models/scaler_Stacking_Temperature.pkl"),
        "features": joblib.load("trained_models/features_Stacking_Temperature.pkl")
    }
}


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    target = data.get("target")
    if target not in param_models:
        return jsonify({"error": f"Unknown target parameter: {target}"}), 400

    model_data = param_models[target]
    model = model_data["model"]
    scaler = model_data["scaler"]
    feature_order = model_data["features"]

    try:
        input_data = [float(data[feature]) for feature in feature_order]
        features_df = pd.DataFrame([input_data], columns=feature_order)
    except KeyError as e:
        return jsonify({"error": f"Missing value: {e}"}), 400

    scaled_input = scaler.transform(features_df)
    prediction = model.predict(scaled_input)

    return jsonify({"prediction": prediction[0]})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)