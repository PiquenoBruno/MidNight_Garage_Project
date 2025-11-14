import userModels from "../models/userModels";
import { Request, Response } from "express";

const listarUsuarios = async (req: Request, res: Response) => {
    const listaDeUsuarios = await userModels.listarUsuarios()
    return res.status(200).json(listaDeUsuarios)
}
const listarAdms = async (req: Request, res: Response) => {
    const listaDeAdms = await userModels.listarAdms()
    return res.status(200).json(listaDeAdms)
}

export default {
    listarUsuarios,
    listarAdms
}