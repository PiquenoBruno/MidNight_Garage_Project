import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useContext(AuthContext);

  return (
    <header className="bg-black w-full z-50">
      <div className="max-w-screen-md mx-auto px-4 py-6 flex flex-col items-center text-center relative">
        {/* Logo centralizado */}
        <div className="flex flex-col items-center">
          <img
            src="/Logo_Midnight2.png"
            alt="Logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-3xl font-bold text-primaria leading-tight">
            MidNight
          </h1>
          <h2 className="text-lg font-medium text-secundaria tracking-wide">
            Garage
          </h2>
        </div>

        {/* Menu desktop centralizado */}
        <nav className="hidden sm:flex justify-center gap-6 mt-6 text-white text-sm font-medium">
          <a href="/" className="hover:text-destaque">
            Home
          </a>
          <a href="/catalogo" className="hover:text-destaque">
            Catálogo
          </a>

          {auth?.user ? (
            <>
              <a href="/profile" className="hover:text-destaque">
                {auth.user.name}
              </a>
              <button
                onClick={auth.logout}
                className="hover:text-destaque text-red-400"
              >
                Sair
              </button>
            </>
          ) : (
            <a href="/login" className="hover:text-destaque">
              Conta
            </a>
          )}

        </nav>

        {/* Botão menu mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-xl sm:hidden absolute top-4 right-4"
          aria-label="Abrir menu"
        >
          ☰
        </button>

        {/* Menu mobile centralizado */}
        {menuOpen && (
          <nav className="absolute top-full left-1/2 transform -translate-x-1/2 w-[90%] sm:hidden bg-text-background rounded-xl shadow-lg mt-2 z-50 text-center">
            {auth?.user ? (
              <>
                <a
                  href="/profile"
                  className="block p-4 hover:bg-destaque hover:text-background rounded-xl"
                >
                  {auth.user.name}
                </a>
                <button
                  onClick={auth.logout}
                  className="block w-full p-4 hover:bg-destaque hover:text-background rounded-xl text-red-500"
                >
                  Sair
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="block p-4 hover:bg-destaque hover:text-background rounded-xl"
              >
                Conta
              </a>
            )}
            <a
              href="/servicos"
              className="block p-4 hover:bg-destaque hover:text-background rounded-xl"
            >
              Serviços
            </a>
            <a
              href="/contatos"
              className="block p-4 hover:bg-destaque hover:text-background rounded-xl"
            >
              Contato
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
