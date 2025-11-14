import express from 'express';
import veiculoController from '../controller/veiculoController';

export const routerVeiculo = express.Router()

// ROTAS PARA CARRO
routerVeiculo.get('/carro', veiculoController.listarCarros)
routerVeiculo.post('/carro', veiculoController.novoCarro)
routerVeiculo.put('/carro/:id', veiculoController.editarCarro)
routerVeiculo.delete('/carro/:id', veiculoController.removerCarro)

// ROTAS PARA MOTO
routerVeiculo.get('/moto', veiculoController.listarMotos)
routerVeiculo.post('/moto', veiculoController.novaMoto)
routerVeiculo.put('/moto/:id', veiculoController.editarMoto)
routerVeiculo.delete('/moto/:id', veiculoController.removerMoto)
