import  express from "express";
import cors from 'cors';
import path from "path";
import { router } from "./routers/router";
import { routerVeiculo } from "./routers/routersVeiculos";
import { routerUsers } from "./routers/routersUsers";

export const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')));
app.use('/', router)
app.use('/', routerVeiculo)
app.use('/', routerUsers)

