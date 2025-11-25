import express from "express";
import pedidoController from "../controller/pedidoController";

export const routerPedidos = express.Router();

routerPedidos.get("/", async (req, res) => {
  const data = await pedidoController.listarPedidos();
  res.json(data);
});

routerPedidos.post("/", async (req, res) => {
  const { usuario_id, veiculo_id } = req.body;
  const data = await pedidoController.criarPedido(usuario_id, veiculo_id);
  res.json(data);
});

routerPedidos.put("/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const data = await pedidoController.atualizarStatus(Number(id), status);
  res.json(data);
});

routerPedidos.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const data = await pedidoController.removerPedido(Number(id));
  res.json(data);
});

export default routerPedidos;
