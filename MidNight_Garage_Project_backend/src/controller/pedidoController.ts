import { Request, Response } from "express";
import pedidoService from "../models/pedidoModels";

// GET /api/pedidos
export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await pedidoService.listarPedidos();
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
};

// POST /api/pedidos
export const criarPedido = async (req: Request, res: Response) => {
  const { usuario_id, veiculo_id } = req.body;

  if (!usuario_id || !veiculo_id) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
  }

  try {
    const novo = await pedidoService.criarPedido(usuario_id, veiculo_id);
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
};

// PUT /api/pedidos/:id
export const atualizarStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ erro: "Status é obrigatório" });
  }

  try {
    const atualizado = await pedidoService.atualizarStatus(Number(id), status);
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status" });
  }
};

// DELETE /api/pedidos/:id
export const removerPedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const removido = await pedidoService.removerPedido(Number(id));
    res.json(removido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover pedido" });
  }
};
