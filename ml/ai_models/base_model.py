from abc import ABC, abstractmethod
import pandas as pd
import joblib
import os

class BaseModel(ABC):
    def __init__(self, name: str, model_path: str, scaler_path: str, features: list):
        self.name = name
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.features = features
        self.model = None
        self.scaler = None

    def load(self):
        if not (os.path.exists(self.model_path) and os.path.exists(self.scaler_path)):
            raise FileNotFoundError(f"Missing model or scaler for {self.name}")
        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)

    @abstractmethod
    def prepare_input(self, input_data: dict) -> pd.DataFrame:
        ...

    def predict(self, input_data: dict) -> dict:
        if self.model is None or self.scaler is None:
            raise ValueError("Model or scaler not loaded.")

        try:
            df = self.prepare_input(input_data)
            scaled = self.scaler.transform(df)
            prediction = self.model.predict(scaled)[0]
            return {
                "disease": self.name,
                "prediction": bool(prediction)
            }
        except Exception as e:
            return {"disease": self.name, "error": str(e)}
