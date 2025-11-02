export default function Slogan() {
  
  return (
    <section
      className="flex items-center justify-center text-center px-6 py-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/midnight_fundo01.gif')",
        backgroundPosition: "center 0px",
      }}
    >
      <div className="bg-cover bg-[position:center_150px] flex items-center justify-center text-center px-6 py-32 sm:py-40 md:py-48">
        <p className="text-text-color text-lg md:text-xl italic leading-relaxed">
          “Não é sobre o que você perdeu. É sobre como você chegou." <br />
          Veja nossa garagem e encontre seu estilo!
        </p>
      </div>
    </section>
  );
}
