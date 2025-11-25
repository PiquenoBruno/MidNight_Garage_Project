interface CardItem {
  title: string;
  link: string;
  description: string;
  backgroundImage: string; // Nova propriedade para a imagem de fundo
}

interface MenuCardsProps {
  onChatButtonClick?: () => void;
}

const cardData: CardItem[] = [
  { 
    title: 'MidNight Seller', 
    link: '/vender', 
    description: 'Venda seu carro conosco.',
    backgroundImage: '/images/seller-bg.jpg' // Altere para o caminho da sua imagem
  },
  { 
    title: 'Garage', 
    link: '/catalogo', 
    description: 'Encontre carros únicos na nossa garagem.',
    backgroundImage: '/images/garage-bg.jpg' // Altere para o caminho da sua imagem
  },
  { 
    title: 'Dúvidas? Fale com a gente', 
    link: '#', 
    description: 'Estamos aqui para te ajudar!',
    backgroundImage: '/images/chat-bg.jpg' // Altere para o caminho da sua imagem
  },
];

export default function MenuCards({ onChatButtonClick }: MenuCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cardData.map((card, index) => {
        const cardStyle = {
          backgroundImage: `url(${card.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };

        if (card.title.includes("Dúvidas")) {
          return (
            <button
              key={index}
              onClick={onChatButtonClick}
              style={cardStyle}
              className="group relative bg-text-background text-text-color p-32 rounded-lg 
                text-center shadow-md transition-all duration-300 origin-bottom 
                hover:-translate-y-2 hover:text-text-background hover:bg-text-color
                overflow-hidden"
            >
              {/* Overlay para melhorar legibilidade do texto */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="mt-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.description}
                </p>
              </div>
            </button>
          );
        }

        return (
          <a
            key={index}
            href={card.link}
            style={cardStyle}
            className="group relative bg-text-background text-text-color p-32 rounded-lg 
              text-center shadow-md transition-all duration-300 origin-bottom 
              hover:-translate-y-2 hover:text-text-background hover:bg-text-color
              overflow-hidden"
          >
            {/* Overlay para melhorar legibilidade do texto */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {card.description}
              </p>
            </div>
          </a>
        );
      })}
    </section>
  );
}