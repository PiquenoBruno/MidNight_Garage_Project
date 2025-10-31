interface CardItem {
  title: string;
  link: string;
}

const cardData: CardItem[] = [
  { title: 'MidNight Seller', link: '#' },
  { title: 'Garage', link: '#' },
  { title: 'Dúvidas? Fale com a gente', link: '#' },
];

export default function MenuCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cardData.map((card, index) => (
        <a
          key={index}
          href={card.link}
          className="bg-text-background text-text-color p-8 rounded-lg text-center shadow-md hover:bg-destaque hover:text-background transition duration-300 cursor-pointer"
        >
          <h2 className="text-xl font-semibold">{card.title}</h2>
        </a>
      ))}
    </section>
  );
}
