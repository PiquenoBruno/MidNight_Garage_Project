import { useState, useContext } from "react";
import type { FormEvent, ChangeEvent } from "react";

import InputField from "./inputField";
import Button from "./button";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Digite um e-mail válido.");
      return;
    }

    setError("");

    try {
      // chama o login do contexto (que já fala com o backend)
      await auth?.login(email, senha);

      // se quiser redirecionar após login:
      window.location.href = "/profile";
    } catch {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSenhaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleLogin}>
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
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <Button text="ENTRAR" />
      <div className="text-center mt-4">
        <a href="/cadastro" className="text-sm text-primaria hover:underline">
          CADASTRAR
        </a>
      </div>
    </form>
  );
}
