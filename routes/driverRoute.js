import express from "express";
import { assignDriverAutomatically } from "../controllers/driverController.js";

const router = express.Router();

// Route to assign a driver automatically
router.post("/assign-driver", assignDriverAutomatically);

export default router;
