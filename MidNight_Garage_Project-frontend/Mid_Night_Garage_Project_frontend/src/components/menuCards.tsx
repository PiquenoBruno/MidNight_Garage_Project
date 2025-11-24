interface CardItem {
  title: string;
  link: string;
  description: string;
}

interface MenuCardsProps {
  onChatButtonClick?: () => void;
}

const cardData: CardItem[] = [
  { title: 'MidNight Seller', link: '/vender', description: 'Venda seu carro conosco.' },
  { title: 'Garage', link: '/catalogo', description: 'Encontre carros únicos na nossa garagem.' },
  { title: 'Dúvidas? Fale com a gente', link: '#', description: 'Estamos aqui para te ajudar!' }, // card chat
];

export default function MenuCards({ onChatButtonClick }: MenuCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cardData.map((card, index) => {
        // Se for o card de dúvidas, usa botão mas com mesmas cores dos outros
        if (card.title.includes("Dúvidas")) {
          return (
            <button
              key={index}
              onClick={onChatButtonClick}
              className="group bg-text-background text-text-color p-32 rounded-lg 
                text-center shadow-md transition-all duration-300 origin-bottom 
                hover:-translate-y-2 hover:text-text-background hover:bg-text-color"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {card.description}
              </p>
            </button>
          );
        }

        // Cards normais continuam como <a>
        return (
          <a
            key={index}
            href={card.link}
            className="group bg-text-background text-text-color p-32 rounded-lg 
              text-center shadow-md transition-all duration-300 origin-bottom 
              hover:-translate-y-2 hover:text-text-background hover:bg-text-color"
          >
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="mt-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {card.description}
            </p>
          </a>
        );
      })}
    </section>
  );
}
