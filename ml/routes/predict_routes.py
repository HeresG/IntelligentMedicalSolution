from flask import Blueprint, request, jsonify
from concurrent.futures import ThreadPoolExecutor

from ai_models.registry import models

predict_routes = Blueprint("predict_routes", __name__)

@predict_routes.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    parameters = data.get("parameters")

    if not parameters:
        return jsonify({"error": "Missing 'parameters' in request body"}), 400

    def is_model_compatible(model):
        return all(feature in parameters for feature in model.features)

    compatible_models = [m for m in models if is_model_compatible(m)]

    if not compatible_models:
        return jsonify({"results": []}), 200

    def run_model(model):
        try:
            return model.predict(parameters)
        except Exception as e:
            return {"disease": model.name, "error": str(e)}

    with ThreadPoolExecutor() as executor:
        results = list(executor.map(run_model, compatible_models))

    return jsonify({"results": results})

