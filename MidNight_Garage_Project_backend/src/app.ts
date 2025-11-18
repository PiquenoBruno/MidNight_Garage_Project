import express from "express";
import cors from "cors";
import path from "path";

// Importa os grupos de rotas
import { router } from "./routers/router";
import { routerVeiculo } from "./routers/routersVeiculos";
import { routerUsers } from "./routers/routersUsers";
import { routerAdmins } from "./routers/routersAdmins";
import { routerPedidos} from "./routers/routersPedido"; // 🆕 novo router

export const app = express();

// Middlewares globais
app.use(cors()); // Permite chamadas do frontend
app.use(express.json()); // Permite trabalhar com JSON no body
app.use(express.static(path.join(__dirname, "static"))); // Arquivos estáticos

// Rotas organizadas com prefixos
app.use("/api", router);                  // Rotas gerais
app.use("/api/veiculos", routerVeiculo);  // Rotas de veículos (carros e motos)
app.use("/api/users", routerUsers);       // Rotas de usuários
app.use("/api/admins", routerAdmins);     // Rotas de administradores
app.use("/api/pedidos", routerPedidos);   // 🆕 Rotas de pedidos


export default app;
