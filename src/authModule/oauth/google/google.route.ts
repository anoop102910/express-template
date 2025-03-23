import { Router } from "express";
import { GoogleController } from "./google.controller";
import { asyncHandler } from "../../../utils/asyncHandler";
import { googleAuthSchema } from "./google.validation";
import { validate } from "../../../middleware/validate";
const router = Router();
const googleController = new GoogleController();

router.get("/auth", validate(googleAuthSchema), asyncHandler(googleController.googleAuth.bind(googleController)));
router.get("/callback", validate(googleAuthSchema), asyncHandler(googleController.googleCallback.bind(googleController)));

export default router;
