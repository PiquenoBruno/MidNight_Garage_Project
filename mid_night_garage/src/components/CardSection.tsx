import React from 'react';

const cards = [
  { title: 'MidNight Seller' },
  { title: 'Garage' },
  { title: 'Dúvidas? Fale com a gente' },
];

const CardSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 px-4 py-8 bg-white">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded-lg shadow-md p-6 text-center flex-1"
        >
          <h2 className="text-lg font-medium">{card.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
