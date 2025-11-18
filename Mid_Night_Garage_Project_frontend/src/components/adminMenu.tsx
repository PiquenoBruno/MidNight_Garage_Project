import { useLocation } from "react-router-dom";

interface CardItem {
  title: string;
  link: string;
  description: string;
}

const cardData: CardItem[] = [
  { title: "DashBoard", link: "/dashboard", description: "Visão geral e lista de veículos" },
  { title: "Pedidos", link: "/pedidolist", description: "Solicitações de compra" },
  { title: "Clientes", link: "/userlist", description: "Cadastro e lista de clientes" },
  { title: "Admins", link: "/adminlist", description: "Cadastro e lista de admins" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
      <aside
        className="fixed top-0 left-0 z-50 bg-background text-text-color h-screen w-64 
                  transition-all duration-300 font-sans shadow-lg 
                  border-r border-white"
      >

      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-text-background">
        <h1 className="text-xl font-bold text-destaque animate-fadeIn">
          Administração
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-2">
        {cardData.map((item, index) => {
          const isActive = location.pathname === item.link;
          return (
            <a
              key={index}
              href={item.link}
              className={`flex flex-col px-4 py-3 rounded-xl transition-colors
                          ${isActive ? "bg-destaque text-black shadow-md" : "hover:bg-text-background"}`}
            >
              <span className="text-sm font-semibold">{item.title}</span>
              <span className={`text-xs ${isActive ? "text-black" : "text-primaria opacity-70"}`}>
                {item.description}
              </span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
