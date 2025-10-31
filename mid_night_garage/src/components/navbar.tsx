import React from 'react';

const Navbar: React.FC = () => {
    return(
         <nav className="bg-black text-white px-4 py-3 flex items-center">
      <button className="mr-2">
        <span className="text-xl">☰</span>
      </button>
      <span className="text-sm">Voltar</span>
    </nav>
    );
};

export default Navbar;
