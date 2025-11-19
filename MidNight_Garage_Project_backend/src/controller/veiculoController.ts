import { Request, Response } from "express";
import veioculosModels from "../models/veioculosModels";


// =====================
// LISTAR VEÍCULOS
// =====================
const listarVeiculos = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const veiculos = await veioculosModels.listarVeiculos(type as string);
    res.json(veiculos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar veículos" });
  }
};

// =====================
// CRIAR VEÍCULO
// =====================
const novoVeiculo = async (req: Request, res: Response) => {
  try {
    const { type, name, brand, year, price, description, vendido } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const novo = await veioculosModels.novoVeiculo({
      id: 0,
      type,
      name,
      brand,
      year: Number(year),
      price: Number(price),
      description,
      image: imagePath,
      vendido: vendido === "true" || vendido === true,
    });

    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar veículo" });
  }
};

// =====================
// EDITAR VEÍCULO
// =====================
const editarVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, name, brand, year, price, description, vendido } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : req.body.image;

    const editado = await veioculosModels.editarVeiculo(Number(id), {
      id: Number(id),
      type,
      name,
      brand,
      year: Number(year),
      price: Number(price),
      description,
      image: imagePath,
      vendido: vendido === "true" || vendido === true,
    });

    res.json(editado);
  } catch (err) {
    res.status(500).json({ error: "Erro ao editar veículo" });
  }
};

// =====================
// REMOVER VEÍCULO
// =====================
const removerVeiculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removido = await veioculosModels.removerVeiculo(Number(id));
    res.json(removido);
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover veículo" });
  }
};

export default {
  listarVeiculos,
  novoVeiculo,
  editarVeiculo,
  removerVeiculo,
};
