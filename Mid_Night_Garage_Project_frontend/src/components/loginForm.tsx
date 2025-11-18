import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import InputField from "./inputField";
import Button from "./button";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
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
    console.log("Login:", email, senha);

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
