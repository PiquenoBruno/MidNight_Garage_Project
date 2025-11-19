import express from "express";
import multer from "multer";
import path from "path";
import veiculoController from "../controller/veiculoController";

export const routerVeiculo = express.Router();

// =====================
// CONFIGURAÇÃO DO MULTER
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images")); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName); // nome único para evitar conflitos
  },
});

const upload = multer({ storage });

// =====================
// ROTAS
// =====================
routerVeiculo.get("/", veiculoController.listarVeiculos);
routerVeiculo.post("/", upload.single("imagem"), veiculoController.novoVeiculo);
routerVeiculo.put("/:id", upload.single("imagem"), veiculoController.editarVeiculo);
routerVeiculo.delete("/:id", veiculoController.removerVeiculo);
