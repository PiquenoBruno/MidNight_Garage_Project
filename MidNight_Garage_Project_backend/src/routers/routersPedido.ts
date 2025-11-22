import express from "express";
import {
  listarPedidos,
  criarPedido,
  atualizarStatus,
  removerPedido,
} from "../controller/pedidoController";

export const routerPedidos = express.Router();

routerPedidos.get("/", listarPedidos);
routerPedidos.post("/", criarPedido);
routerPedidos.put("/:id", atualizarStatus);
routerPedidos.delete("/:id", removerPedido);

export default routerPedidos;
