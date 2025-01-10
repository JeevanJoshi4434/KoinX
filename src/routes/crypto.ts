import express from "express";
import { CryptoController } from "../controllers/crypto";

const router = express.Router();

router.get("/stats", CryptoController.getStats);
router.get("/deviation", CryptoController.getPriceDeviation);

export default router;