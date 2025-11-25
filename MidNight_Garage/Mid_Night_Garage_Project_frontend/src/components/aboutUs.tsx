export default function About() {
  return (
    <section
      aria-labelledby="about-title"
      className="bg-black text-white px-6 py-12 w-full font-sans"
    >
      <div className="max-w-3xl mx-auto">
        <h2 id="about-title" className="text-3xl font-bold text-primaria mb-2">
          Sobre nós
        </h2>
        <h3 className="text-lg text-gray-400 mb-6">
          Paixão por carros, compromisso com você
        </h3>
        <p className="mb-4 leading-relaxed">
          Na <strong>MidNight Garage</strong>, não vendemos apenas carros — oferecemos experiências sobre rodas. Somos especialistas em veículos que combinam desempenho, autenticidade e estilo para quem valoriza personalidade na direção.
        </p>
        <p className="leading-relaxed">
          Nosso compromisso é com negociações justas, seguras e transparentes. Cada veículo é escolhido com cuidado, pensando em quem sabe o que quer e valoriza uma boa escolha.
        </p>
      </div>
    </section>
  );
}
