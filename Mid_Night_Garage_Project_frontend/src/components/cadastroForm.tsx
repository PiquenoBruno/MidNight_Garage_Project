import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import InputField from "./inputField";
import Button from "./button";

export default function CadastroForm() {
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCadastro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
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
    console.log("Cadastro:", { nome, email, senha });

    try {
      const response = await fetch("https://seu-backend.com/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Erro ao cadastrar.");
        return;
      }

      console.log("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
    } catch (err) {
      setError("Erro de conexão com o servidor.");
      console.error(err);
    }
  };

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSenhaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };

  const handleConfirmarSenhaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleCadastro}>
      <InputField
        label="NOME"
        type="text"
        value={nome}
        onChange={handleNomeChange}
      />
      <InputField
        label="EMAIL"
        type="email"
        value={email}
        onChange={handleEmailChange}
      />
      <InputField
        label="SENHA"
        type="password"
        value={senha}
        onChange={handleSenhaChange}
      />
      <InputField
        label="CONFIRMAR SENHA"
        type="password"
        value={confirmarSenha}
        onChange={handleConfirmarSenhaChange}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <Button text="CADASTRAR" />
      <div className="text-center mt-4">
        <a href="/login" className="text-sm text-primaria hover:underline">
          JÁ TEM CONTA? ENTRAR
        </a>
      </div>
    </form>
  );
}
