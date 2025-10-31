import { useState } from 'react';

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-background p-5 relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white text-xl cursor-pointer"
        aria-label="Abrir menu"
      >
        ☰
      </button>
      {menuOpen && (
        <ul className="absolute top-[70px] left-5 w-[90%] sm:w-[200px] bg-text-background rounded-xl z-[100] shadow-lg">
          <li><a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Conta</a></li>
          <li><a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Serviços</a></li>
          <li><a href="#" className="block p-4 hover:bg-destaque hover:text-background rounded-xl">Contato</a></li>
        </ul>
      )}
    </nav>
  );
}
