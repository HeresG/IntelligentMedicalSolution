import pandas as pd

from ai_models.base_model import BaseModel


class LiverDiseaseModel(BaseModel):
    def __init__(self):
        super().__init__(
            name="Boala de ficat",
            model_path="ai_models/resources/liver_disease_model.joblib",
            scaler_path="ai_models/resources/liver_disease_scaler.joblib",
            features=[
                "Age", "Gender", "Total_Bilirubin", "Direct_Bilirubin",
                "Alkaline_Phosphotase", "Alamine_Aminotransferase",
                "Aspartate_Aminotransferase", "Total_Protiens",
                "Albumin", "Albumin_and_Globulin_Ratio"
            ]
        )

    def prepare_input(self, input_data: dict) -> pd.DataFrame:
        clean_data = {}
        for key in self.features:
            if key not in input_data:
                raise ValueError(f"Missing required feature: {key}")

            if key == "Gender":
                gender_val = input_data["Gender"]
                if str(gender_val).lower() in ["female", "f", "0"]:
                    clean_data["Gender"] = 0
                elif str(gender_val).lower() in ["male", "m", "1"]:
                    clean_data["Gender"] = 1
                else:
                    raise ValueError(f"Invalid gender value: {gender_val}")
            else:
                clean_data[key] = input_data[key]

        return pd.DataFrame([clean_data])
