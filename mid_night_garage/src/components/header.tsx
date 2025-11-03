import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-background w-full z-50">
      <div className="max-w-screen-md mx-auto px-4 py-6 flex flex-col items-center justify-center text-center relative">
        {/* Logo centralizado */}
        <img src="/Logo_Midnight2.png" alt="Logo" className="w-16 h-16 mb-2" />

        {/* Título e subtítulo empilhados */}
        <h1 className="text-3xl font-bold text-primaria leading-tight">MidNight</h1>
        <h2 className="text-lg font-medium text-secundaria tracking-wide">Garage</h2>

        {/* Menu desktop abaixo do título */}
        <nav className="hidden sm:flex gap-6 mt-6 text-white text-sm font-medium">
          <a href="#" className="hover:text-destaque">Conta</a>
          <a href="#" className="hover:text-destaque">Serviços</a>
          <a href="#" className="hover:text-destaque">Contato</a>
        </nav>

        {/* Botão menu mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-xl sm:hidden absolute top-4 right-4"
          aria-label="Abrir menu"
        >
          ☰
        </button>

        {/* Menu mobile */}
        {menuOpen && (
          <nav className="absolute top-full left-4 w-[90%] sm:hidden bg-text-background rounded-xl shadow-lg mt-2 z-50">
            <a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Conta</a>
            <a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Serviços</a>
            <a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Contato</a>
          </nav>
        )}
      </div>
    </header>
  );
}
