import express from "express";
import veiculoController from "../controller/veiculoController";

export const routerVeiculo = express.Router();

routerVeiculo.get("/", veiculoController.listarVeiculos); // ?type=carro ou ?type=moto
routerVeiculo.post("/", veiculoController.novoVeiculo);
routerVeiculo.put("/:id", veiculoController.editarVeiculo);
routerVeiculo.delete("/:id", veiculoController.removerVeiculo);
