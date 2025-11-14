import veioculoModels from "../models/veioculoModels";
import { Request, Response } from "express";


// MANIPULACAO DA TABELA CARROS...
const listarCarros = async (req: Request, res: Response) => {
    const listarCarros = await veioculoModels.listarCarros()
    return res.status(200).json(listarCarros)
}
const novoCarro = async (req: Request, res: Response) => {
    const novoCarro = await veioculoModels.novoCarro(req.body)
    return res.status(200).json(novoCarro)
}
const editarCarro = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const carroEditado = await veioculoModels.editarCarro(id, req.body)
    return res.status(200).json(carroEditado)
}
const removerCarro = async (req: Request, res: Response) => {
    const id = Number(req.params.body)
    const carroRemovido = await veioculoModels.removerCarro(id)
    return res.status(200).json(carroRemovido)
}

// MANIPULACAO DA TABELA MOTOS...
const listarMotos = async (req: Request, res: Response) => {
    const listarMotos = await veioculoModels.listarMotos()
    return res.status(200).json(listarMotos)
}
const novaMoto = async (req: Request, res: Response) => {
    const novaMoto = await veioculoModels.novaMoto(req.body)
    return res.status(200).json(novaMoto)
}
const editarMoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const motoEditada = await veioculoModels.editarMoto(id, req.body)
    return res.status(200).json(motoEditada)
}
const removerMoto = async (req: Request, res: Response) => {
    const id = Number(req.params.body)
    const motoRemovida = await veioculoModels.removerMoto(id)
    return res.status(200).json(motoRemovida)
}

export default {
    listarCarros,
    novoCarro,
    editarCarro,
    removerCarro,
    listarMotos,
    novaMoto,
    editarMoto,
    removerMoto
}