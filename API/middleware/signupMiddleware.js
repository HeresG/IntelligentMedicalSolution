import { signupSchema } from "../validation/signup.js";

export const validateSignup = async (req, res, next) => {
    try {
      await signupSchema.validate(req.body, { abortEarly: false });
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