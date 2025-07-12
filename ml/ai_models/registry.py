from ai_models.liver_model import LiverDiseaseModel
from ai_models.breast_cancer_model import BreastCancerModel

models = [LiverDiseaseModel(), BreastCancerModel()]
for model in models:
    model.load()
