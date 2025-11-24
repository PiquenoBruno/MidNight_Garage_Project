export default function HeaderAdmin() {
  return (
    <header className="bg-background w-full z-50">
      <div className="max-w-screen-md mx-auto px-4 py-6 flex flex-col items-center justify-center text-center relative">
        {/* Logo centralizado */}
        <img src="/Logo_Midnight2.png" alt="Logo" className="w-16 h-16 mb-2" />

        {/* Título e subtítulo empilhados */}
        <h1 className="text-3xl font-bold text-primaria leading-tight">MidNight</h1>
        <h2 className="text-lg font-medium text-secundaria tracking-wide">Garage / Admin</h2>
      </div>

        <nav className="hidden sm:flex justify-center gap-6 mt-6 text-white text-sm font-medium">
          <a href="/" className="hover:text-destaque">Home</a>
          <a href="#" className="hover:text-destaque">Conta</a>
        </nav>


      {/* Linha separadora */}
      <div className="border-t border-gray-300"></div>
    </header>
  );
}
