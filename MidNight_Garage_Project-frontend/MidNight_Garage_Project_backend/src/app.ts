import express from "express";
import cors from "cors";
import path from "path";

// Importa os grupos de rotas
import { router } from "./routers/router";
import { routerVeiculo } from "./routers/routersVeiculos";
import { routerUsers } from "./routers/routersUsers";
import { routerAdmins } from "./routers/routersAdmins";
import { routerPedidos } from "./routers/routersPedido";
import routerLogin from "./routers/routerLogin"; // 🆕 rota de login

export const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Servir imagens
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "static")));

// ROTAS
app.use("/api", router);
app.use("/api/veiculos", routerVeiculo);
app.use("/api/users", routerUsers);
app.use("/api/admins", routerAdmins);
app.use("/api/pedidos", routerPedidos);

// 🆕 ROTA DE LOGIN (SEM PREFIXO /api — como você pediu)
app.use("/login", routerLogin);

export default app;
