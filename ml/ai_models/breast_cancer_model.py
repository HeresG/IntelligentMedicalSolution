import joblib
import pandas as pd

from ai_models.base_model import BaseModel


class BreastCancerModel(BaseModel):
    def __init__(self):
        super().__init__(
            name="Cancer mamar",
            model_path="ai_models/resources/breast_cancer_model.joblib",
            scaler_path="ai_models/resources/breast_cancer_scaler.joblib",
            features=[
                "radius_mean",
                "texture_mean",
                "perimeter_mean",
                "area_mean",
                "smoothness_mean",
                "compactness_mean",
                "concavity_mean",
                "concave points_mean"
            ]
        )

    def prepare_input(self, input_data: dict) -> pd.DataFrame:
        missing = [f for f in self.features if f not in input_data]
        if missing:
            raise ValueError(f"Missing required features: {', '.join(missing)}")

        return pd.DataFrame([input_data], columns=self.features)

