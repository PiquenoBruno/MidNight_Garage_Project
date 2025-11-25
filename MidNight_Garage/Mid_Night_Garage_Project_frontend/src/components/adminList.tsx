import React, { useEffect, useState } from "react";
import { EditarUsuarioModal } from "./formsUsuario";
import Swal from "sweetalert2";

interface Admin {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
  admin: boolean;
}

const API_URL_ADM = "http://localhost:3001/api/admins";
const API_URL_USERS = "http://localhost:3001/api/users";

export const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSelecionado, setAdminSelecionado] = useState<Admin | null>(null);
  const [metodo, setMetodo] = useState<"POST" | "PUT">("POST");

  const fetchAdmins = async () => {
    try {
      const res = await fetch(API_URL_ADM);
      if (!res.ok) throw new Error("Erro ao buscar administradores");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setAdmins(data);
      } else {
        console.error("Resposta da API não é um array:", data);
        setAdmins([]);
      }
    } catch (err: any) {
      console.error("Erro no fetchAdmins:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const salvarAdmin = async (admin: Admin) => {
    try {
      console.log("Salvando admin:", admin);
      
      if (metodo === "POST") {
        // CORREÇÃO: Segue o mesmo padrão do UserList que funciona
        const payload = {
          nome: admin.nome,
          email: admin.email,
          telefone: admin.telefone.replace(/\D/g, ""),
          senha: admin.senha || "123456",
          admin: false, // Cria como usuário comum primeiro
        };

        console.log("Payload para criar usuário:", payload);

        // 1. Cria o usuário (igual no UserList)
        const resUser = await fetch(API_URL_USERS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resUser.ok) {
          const errorText = await resUser.text();
          console.error("Erro na resposta:", errorText);
          throw new Error(`Erro ao criar usuário: ${errorText}`);
        }

        const novoUsuario = await resUser.json();
        console.log("Usuário criado:", novoUsuario);

        // 2. Promove para administrador
        const resAdm = await fetch(API_URL_ADM, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: novoUsuario.id }),
        });

        if (!resAdm.ok) {
          const errorText = await resAdm.text();
          console.error("Erro ao promover admin:", errorText);
          throw new Error(`Erro ao criar administrador: ${errorText}`);
        }

        console.log("Admin criado com sucesso");

      } else {
        // ATUALIZAÇÃO - apenas atualiza os dados do usuário
        const payload: any = {
          nome: admin.nome,
          email: admin.email,
          telefone: admin.telefone.replace(/\D/g, ""),
        };

        // Só envia senha se foi alterada
        if (admin.senha && admin.senha.trim() !== "") {
          payload.senha = admin.senha;
        }

        console.log("Atualizando usuário:", payload);

        const resUser = await fetch(`${API_URL_USERS}/${admin.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resUser.ok) {
          const errorText = await resUser.text();
          throw new Error(`Erro ao atualizar usuário: ${errorText}`);
        }

        console.log("Usuário atualizado com sucesso");
      }

      await fetchAdmins();
      setIsModalOpen(false);
      Swal.fire("Sucesso!", "Administrador salvo com sucesso.", "success");
    } catch (err: any) {
      console.error("Erro detalhado no salvarAdmin:", err);
      Swal.fire({
        title: "Erro",
        text: err.message || "Erro ao salvar administrador",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const removerAdmin = async (usuario_id: number) => {
    const resultado = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação removerá os privilégios de administrador.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton: "bg-red-600 text-white ml-2 px-4 py-2 rounded hover:bg-red-700",
        cancelButton: "bg-slate-500 text-white ml-2 px-4 py-2 rounded hover:bg-slate-600",
      },
    });

    if (!resultado.isConfirmed) return;

    try {
      console.log("Removendo admin com usuario_id:", usuario_id);
      
      // CORREÇÃO: Testa ambas as formas para ver qual funciona
      let res;
      
      // Tenta primeiro no body (mais comum)
      try {
        res = await fetch(API_URL_ADM, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id }),
        });
      } catch (bodyError) {
        // Se falhar, tenta na URL
        console.log("Tentando via URL...");
        res = await fetch(`${API_URL_ADM}/${usuario_id}`, {
          method: "DELETE",
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao remover administrador: ${errorText}`);
      }

      await fetchAdmins();

      Swal.fire({
        title: "Removido!",
        text: "Os privilégios de administrador foram removidos com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error("Erro no removerAdmin:", err);
      Swal.fire("Erro", err.message, "error");
    }
  };

  const total = admins.length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Administradores</h1>
        <button
          onClick={() => {
            setAdminSelecionado({
              id: 0,
              nome: "",
              email: "",
              telefone: "",
              senha: "",
              admin: true,
            });
            setMetodo("POST");
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Adicionar Admin
        </button>
      </header>

      {loading && <p className="text-slate-500">Carregando administradores...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Total de Administradores</h3>
              <p className="text-2xl font-bold text-emerald-500">{total}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {admins.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum administrador encontrado.</p>
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
                  {admins.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-slate-800">{a.nome}</td>
                      <td className="p-3 text-slate-800">{a.email}</td>
                      <td className="p-3 text-slate-800">{a.telefone}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => {
                            setAdminSelecionado(a);
                            setMetodo("PUT");
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removerAdmin(a.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Remover
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

      {adminSelecionado && (
        <EditarUsuarioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          usuario={adminSelecionado}
          onSave={salvarAdmin}
          titulo={metodo === "PUT" ? "Editar Administrador" : "Adicionar Administrador"}
        />
      )}
    </div>
  );
};