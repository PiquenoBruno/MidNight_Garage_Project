import { Request, Response } from "express";
import admModels from "../models/admModels";

const listarAdms = async (req: Request, res: Response) => {
  try {
    const listaDeAdms = await admModels.listarAdms();
    return res.status(200).json(listaDeAdms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar administradores" });
  }
};

const criarAdm = async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.body;
    const novoAdm = await admModels.criarAdm(usuario_id);
    return res.status(201).json(novoAdm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar administrador" });
  }
};

const atualizarAdm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;
    const admAtualizado = await admModels.atualizarAdm(Number(id), usuario_id);
    return res.status(200).json(admAtualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar administrador" });
  }
};

const removerAdm = async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;
    const admRemovido = await admModels.removerAdm(Number(usuario_id));
    return res.status(200).json(admRemovido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover administrador" });
  }
};

export default {
  listarAdms,
  criarAdm,
  atualizarAdm,
  removerAdm,
};
