import React, { useEffect, useState } from "react";
import { EditarUsuarioModal } from "./formsUsuario";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
  admin: boolean; // pode não refletir a realidade se admin é controlado em tabela separada
}

interface AdminRef {
  id: number;        // pode ser o id da relação admin
  usuario_id: number; // id do usuário que é admin
  nome?: string;
  email?: string;
  // dependendo do seu listarAdms, pode vir os dados do usuário junto
}

const API_URL_USERS = "http://localhost:3001/api/users";
const API_URL_ADMS = "http://localhost:3001/api/admins";

export const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // controle do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [metodo, setMetodo] = useState<"POST" | "PUT">("POST");

  const fetchUsuarios = async () => {
    try {
      // busca todos os usuários
      const resUsers = await fetch(API_URL_USERS);
      if (!resUsers.ok) throw new Error("Erro ao buscar usuários");
      const dataUsers: Usuario[] = await resUsers.json();

      // busca a lista de admins (apenas referências)
      const resAdms = await fetch(API_URL_ADMS);
      if (!resAdms.ok) throw new Error("Erro ao buscar administradores");
      const dataAdms: AdminRef[] = await resAdms.json();

      // cria um conjunto dos ids de usuários que são admins
      const adminIds = new Set<number>(
        dataAdms.map((a) => (typeof a.usuario_id === "number" ? a.usuario_id : a.id))
      );

      // filtra usuários removendo quem está em adminIds
      const apenasComuns = dataUsers.filter((u) => !adminIds.has(u.id));
      setUsuarios(apenasComuns);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const salvarUsuario = async (usuario: Usuario) => {
    try {
      const payload = {
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone.replace(/\D/g, ""),
        senha: usuario.senha || "123456",
        admin: false, // força comum; admins são tratados na lista de admins
      };

      const res = await fetch(
        metodo === "PUT" ? `${API_URL_USERS}/${usuario.id}` : API_URL_USERS,
        {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao salvar usuário: ${msg}`);
      }

      await fetchUsuarios();

      Swal.fire(
        metodo === "PUT" ? "Atualizado!" : "Adicionado!",
        `O usuário foi ${metodo === "PUT" ? "editado" : "criado"} com sucesso.`,
        "success"
      );
    } catch (err: any) {
      Swal.fire("Erro", err.message, "error");
    }
  };

const removerUsuario = async (id: number) => {
  const resultado = await Swal.fire({
    title: "Tem certeza?",
    text: "Essa ação excluirá o usuário permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      confirmButton:
        "bg-red-600 text-white ml-2 px-4 py-2 rounded hover:bg-red-700 focus:outline-none",
      cancelButton:
        "bg-slate-500 text-white ml-2 px-4 py-2 rounded hover:bg-slate-600 focus:outline-none",
    },
  });

  if (!resultado.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL_USERS}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir usuário");

    await fetchUsuarios();

    Swal.fire({
      title: "Excluído!",
      text: "O usuário foi removido com sucesso.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err: any) {
    Swal.fire("Erro", err.message, "error");
  }
};


  const total = usuarios.length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Usuários Comuns</h1>
        <button
          onClick={() => {
            setUsuarioSelecionado({
              id: 0,
              nome: "",
              email: "",
              telefone: "",
              senha: "",
              admin: false,
            });
            setMetodo("POST");
            setIsModalOpen(true);
          }}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
        >
          + Adicionar Usuário
        </button>
      </header>

      {loading && <p className="text-slate-500">Carregando usuários...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Total de Usuários Comuns</h3>
              <p className="text-2xl font-bold text-blue-500">{total}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {usuarios.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum usuário comum encontrado.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-slate-600">Nome</th>
                    <th className="p-3 text-slate-600">Email</th>
                    <th className="p-3 text-slate-600">Telefone</th>
                    <th className="p-3 text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-slate-800">{u.nome}</td>
                      <td className="p-3 text-slate-800">{u.email}</td>
                      <td className="p-3 text-slate-800">{u.telefone}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => {
                            setUsuarioSelecionado(u);
                            setMetodo("PUT");
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removerUsuario(u.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {usuarioSelecionado && (
        <EditarUsuarioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          usuario={usuarioSelecionado}
          onSave={salvarUsuario}
          titulo={metodo === "PUT" ? "Editar Usuário" : "Adicionar Usuário"}
        />
      )}
    </div>
  );
};
