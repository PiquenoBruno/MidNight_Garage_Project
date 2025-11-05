import  express from "express";
import cors from 'cors';
import path from "path";
import { router } from "./router";

export const app = express()
app.use(cors())
app.use(express.json())
app.use('../static', express.static(path.join(__dirname, 'static')));
app.use('/', router)

