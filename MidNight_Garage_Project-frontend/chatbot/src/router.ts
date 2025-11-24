import express from "express";
import chatbotController from "./controllers/chatbotController";


export const router = express.Router()

router.post("/chatbotfiltro", chatbotController.verificar)