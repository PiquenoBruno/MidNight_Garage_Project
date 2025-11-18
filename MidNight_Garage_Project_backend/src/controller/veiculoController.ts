import { Request, Response } from "express";
import veiculoModel from "../models/veioculoModels";

const listarVeiculos = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const data = await veiculoModel.listarVeiculos(type as string);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar veículos" });
  }
};

const novoVeiculo = async (req: Request, res: Response) => {
  try {
    const data = await veiculoModel.novoVeiculo(req.body);
    res.status(201).json({ message: "Veículo criado", data });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar veículo" });
  }
};

const editarVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await veiculoModel.editarVeiculo(Number(id), req.body);
    res.status(200).json({ message: "Veículo atualizado", data });
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar veículo" });
  }
};

const removerVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await veiculoModel.removerVeiculo(Number(id));
    res.status(200).json({ message: "Veículo removido" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover veículo" });
  }
};

export default {
  listarVeiculos,
  novoVeiculo,
  editarVeiculo,
  removerVeiculo,
};
