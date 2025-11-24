import chatbotModel from "../models/chatbotModel";
import { Request, Response } from "express";

const verificar = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ erro: "Campo 'text' não enviado na requisição." });
    }

    const lista = await chatbotModel.verificar({ clienteArgumento: text });
    return res.status(200).json(lista);
  } catch (error) {
    console.error("Erro no verificar:", error);
    return res.status(500).json({ erro: "Falha ao consultar veículos." });
  }
};

export default {
  verificar,
};
