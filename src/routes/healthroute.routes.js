import { Router } from "express";
import { healthcheck } from "../controller/health.controller.js";


const router = Router();
router.route("/").get(healthcheck);
export default router;
