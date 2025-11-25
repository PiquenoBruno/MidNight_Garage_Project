import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import InputField from "./inputField";
import Button from "./button";

export default function CadastroForm() {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>(""); // campo obrigatório
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    setSuccess("");

    try {  
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, telefone, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao cadastrar.");
        return;
      }

      setSuccess("Usuário cadastrado com sucesso!");
      console.log("Usuário cadastrado:", data);

      // limpar campos
      setNome("");
      setEmail("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");

      // opcional: redirecionar para login
      window.location.href = "/login";
    } catch (err) {
      setError("Erro de conexão com o servidor.");
      console.error(err);
    }
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleCadastro}>
      <InputField
        label="NOME"
        type="text"
        value={nome}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
      />
      <InputField
        label="EMAIL"
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <InputField
        label="TELEFONE"
        type="text"
        value={telefone}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
      />
      <InputField
        label="SENHA"
        type="password"
        value={senha}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
      />
      <InputField
        label="CONFIRMAR SENHA"
        type="password"
        value={confirmarSenha}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <Button text="CADASTRAR" />

      <div className="text-center mt-4">
        <a href="/login" className="text-sm text-primaria hover:underline">
          JÁ TEM CONTA? ENTRAR
        </a>
      </div>
    </form>
  );
}
