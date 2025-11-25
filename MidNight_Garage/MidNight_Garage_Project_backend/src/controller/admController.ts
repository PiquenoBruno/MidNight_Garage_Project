import { Request, Response } from "express";
import admModels from "../models/admModels";

const listarAdms = async (req: Request, res: Response): Promise<Response> => {
  try {
    const listaDeAdms = await admModels.listarAdms();
    return res.status(200).json(listaDeAdms);
  } catch (error) {
    console.error("Erro no listarAdms:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ 
      error: "Erro ao listar administradores",
      details: errorMessage 
    });
  }
};

const criarAdm = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usuario_id } = req.body;

    // Validação do input
    if (!usuario_id || typeof usuario_id !== 'number') {
      return res.status(400).json({ 
        error: "ID do usuário é obrigatório e deve ser um número" 
      });
    }

    const novoAdm = await admModels.criarAdm(usuario_id);
    return res.status(201).json(novoAdm);
  } catch (error) {
    console.error("Erro no criarAdm:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ 
      error: "Erro ao criar administrador",
      details: errorMessage 
    });
  }
};

const atualizarAdm = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    // Validações
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        error: "ID do administrador é obrigatório e deve ser um número" 
      });
    }

    if (!usuario_id || typeof usuario_id !== 'number') {
      return res.status(400).json({ 
        error: "ID do usuário é obrigatório e deve ser um número" 
      });
    }

    const admAtualizado = await admModels.atualizarAdm(Number(id), usuario_id);
    return res.status(200).json(admAtualizado);
  } catch (error) {
    console.error("Erro no atualizarAdm:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ 
      error: "Erro ao atualizar administrador",
      details: errorMessage 
    });
  }
};

const removerAdm = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usuario_id } = req.params;

    // Validação
    if (!usuario_id || isNaN(Number(usuario_id))) {
      return res.status(400).json({ 
        error: "ID do usuário é obrigatório e deve ser um número" 
      });
    }

    const admRemovido = await admModels.removerAdm(Number(usuario_id));
    return res.status(200).json(admRemovido);
  } catch (error) {
    console.error("Erro no removerAdm:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ 
      error: "Erro ao remover administrador",
      details: errorMessage 
    });
  }
};

// Adicionar health check se necessário
const healthCheck = async (req: Request, res: Response): Promise<Response> => {
  try {
    const health = await admModels.healthCheck();
    return res.status(200).json(health);
  } catch (error) {
    console.error("Erro no healthCheck:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ 
      error: "Erro no health check",
      details: errorMessage 
    });
  }
};

export default {
  listarAdms,
  criarAdm,
  atualizarAdm,
  removerAdm,
  healthCheck // opcional
};