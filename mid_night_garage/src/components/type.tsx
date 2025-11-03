export default function TypeGarage() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-5 md:px-10 pt-4 md:pt-10"
      style={{
        backgroundImage: "url('/midnight_fundo01.gif')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-row flex-wrap justify-center gap-5 -mt-10">
        {/* Botão Carros */}
        <div className="group">
          <button
            className="w-[180px] h-[260px] sm:w-[260px] sm:h-[360px] md:w-[340px] md:h-[480px] lg:w-[420px] lg:h-[700px] text-[16px] sm:text-[18px] md:text-[20px] text-text-color
              bg-[rgba(26,26,26,0.2)] sm:bg-[rgba(26,26,26,0.5)] group-hover:bg-car-hover bg-no-repeat bg-cover bg-center
              flex items-center justify-center border border-transparent group-hover:border-white group-hover:shadow-[0_0_12px_white]
              transition-all duration-300"
          >
            <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_white]">
              Carros
            </span>
          </button>
        </div>

        {/* Botão Motos */}
        <div className="group">
          <button
            className="w-[180px] h-[260px] sm:w-[260px] sm:h-[360px] md:w-[340px] md:h-[480px] lg:w-[420px] lg:h-[700px] text-[16px] sm:text-[18px] md:text-[20px] text-text-color
              bg-[rgba(26,26,26,0.2)] sm:bg-[rgba(26,26,26,0.5)] group-hover:bg-moto-hover bg-no-repeat bg-cover bg-center
              flex items-center justify-center border border-transparent group-hover:border-white group-hover:shadow-[0_0_12px_white]
              transition-all duration-300"
          >
            <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_white]">
              Motos
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
