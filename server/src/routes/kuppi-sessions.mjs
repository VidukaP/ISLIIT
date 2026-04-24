import { Router } from "express";
import {
  listKuppiSessions,
  getKuppiSession,
  createKuppiSession,
  updateKuppiSession,
  deleteKuppiSession,
} from "../controllers/kuppi-sessions.controller.mjs";
import sessionRegistrationRoutes from "./session-registrations.mjs";

const router = Router();

router.get("/", listKuppiSessions);
router.get("/:id", getKuppiSession);
router.post("/", createKuppiSession);
router.put("/:id", updateKuppiSession);
router.delete("/:id", deleteKuppiSession);

// Mount session registration routes
router.use("", sessionRegistrationRoutes);

export default router;
