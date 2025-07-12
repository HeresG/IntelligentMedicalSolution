import { personalDataSetupSchema } from "../validation/personalData.js";

export const validatePersonalDataSetup = async (req, res, next) => {
    try {
      await personalDataSetupSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      res.status(400).json({
        errors: err.inner.map(e => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
  };