import chatbotModel from "../models/chatbotModel";
import { Request, Response } from "express";

const verificar = async (req: Request, res: Response) => {
    const lista = await chatbotModel.verificar(req.body)
    return res.status(200).json(lista)
}

export default {
    verificar
}
