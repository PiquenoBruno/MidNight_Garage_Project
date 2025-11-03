export default function Header() {
  return (
    <header className="bg-background text-center py-0"> {/* py-0 ou py-0.5 */}
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-lg text-primaria leading-none mb-0">MidNight Garage</h1> {/* text-lg menor */}
      </div>

      <img
        src="/Logo_Midnight.png"
        alt="Logo da MidNight Garage"
        className="w-16 mt-0 block mx-auto" /* w-16 = 64px, remova margin negativa */
      />
    </header>
  );
}
