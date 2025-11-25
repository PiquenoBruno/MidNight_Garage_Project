import { connectionModel } from './connectionModels';

// Definir interfaces
interface Administrador {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
}

interface ResultadoOperacao {
  usuario_id: number;
  admin: boolean;
}

interface HealthCheckResult {
  connected: boolean;
  timestamp: string;
  message?: string;
  error?: string;
}

// Listar todos os administradores
const listarAdms = async (): Promise<Administrador[]> => {
  try {
    const [rows] = await connectionModel.query(`
      SELECT u.id, u.nome, u.email, true AS admin
      FROM usuarios u
      INNER JOIN administradores a ON u.id = a.usuario_id
    `);
    return rows as Administrador[];
  } catch (error) {
    console.error('Erro ao listar administradores:', error);
    throw new Error(`Erro ao listar administradores: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Criar administrador (promover usuário existente)
const criarAdm = async (usuario_id: number): Promise<ResultadoOperacao> => {
  try {
    await connectionModel.query(
      "INSERT INTO administradores (usuario_id) VALUES (?)", 
      [usuario_id]
    );
    return { usuario_id, admin: true };
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    throw new Error(`Erro ao criar administrador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Atualizar administrador
const atualizarAdm = async (id: number, novoUsuarioId: number): Promise<{id: number, usuario_id: number, admin: boolean}> => {
  try {
    await connectionModel.query(
      "UPDATE administradores SET usuario_id = ? WHERE id = ?", 
      [novoUsuarioId, id]
    );
    return { id, usuario_id: novoUsuarioId, admin: true };
  } catch (error) {
    console.error('Erro ao atualizar administrador:', error);
    throw new Error(`Erro ao atualizar administrador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Remover administrador (rebaixar para usuário comum)
const removerAdm = async (usuario_id: number): Promise<ResultadoOperacao> => {
  try {
    await connectionModel.query(
      "DELETE FROM administradores WHERE usuario_id = ?", 
      [usuario_id]
    );
    return { usuario_id, admin: false };
  } catch (error) {
    console.error('Erro ao remover administrador:', error);
    throw new Error(`Erro ao remover administrador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Verificar se usuário é administrador
const verificarAdm = async (usuario_id: number): Promise<boolean> => {
  try {
    const [rows] = await connectionModel.query(
      "SELECT * FROM administradores WHERE usuario_id = ?",
      [usuario_id]
    );
    
    const administradores = rows as any[];
    return administradores.length > 0;
  } catch (error) {
    console.error('Erro ao verificar administrador:', error);
    throw new Error(`Erro ao verificar administrador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Health check da conexão
const healthCheck = async (): Promise<HealthCheckResult> => {
  try {
    const [result] = await connectionModel.query("SELECT 1 as connected");
    return { 
      connected: true, 
      timestamp: new Date().toISOString(),
      message: 'Conexão com o banco estabelecida'
    };
  } catch (error) {
    console.error('Health check falhou:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString() 
    };
  }
};

export default {
  listarAdms,
  criarAdm,
  atualizarAdm,
  removerAdm,
  verificarAdm,
  healthCheck
};