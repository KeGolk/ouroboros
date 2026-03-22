export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center animate-fade-in">
      {/* Title section */}
      <div className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-gold-600 mb-4">
          A Branching Narrative RPG
        </p>
        <h2 className="text-shadow-dark font-display text-5xl font-bold tracking-tight text-parchment-100 sm:text-6xl md:text-7xl">
          Crowns of Ash
        </h2>
        <div className="divider-ornate mx-auto mt-6 max-w-xs" />
        <p className="mt-6 max-w-md font-body text-lg text-parchment-400 leading-relaxed">
          Forge alliances. Betray kingdoms. Claim the throne — or die in the
          shadows of those who do.
        </p>
      </div>

      {/* Action cards */}
      <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="parchment-panel p-6 text-center transition-all duration-300 hover:shadow-inner-glow cursor-pointer group">
          <h3 className="font-display text-sm uppercase tracking-wider text-gold-400 group-hover:text-gold-300">
            New Campaign
          </h3>
          <p className="mt-2 font-body text-sm text-parchment-500">
            Begin your journey through blood and fire
          </p>
        </div>
        <div className="parchment-panel p-6 text-center transition-all duration-300 hover:shadow-inner-glow cursor-pointer group">
          <h3 className="font-display text-sm uppercase tracking-wider text-parchment-300 group-hover:text-parchment-100">
            Continue
          </h3>
          <p className="mt-2 font-body text-sm text-parchment-500">
            Resume your tale of treachery and ambition
          </p>
        </div>
      </div>

      {/* Atmospheric flavor */}
      <div className="mt-16 max-w-lg text-center">
        <p className="font-body text-sm italic text-parchment-600 leading-relaxed">
          The iron throne awaits. But the path is paved with broken oaths,
          poisoned cups, and the ashes of fallen houses.
        </p>
      </div>
    </div>
  );
}
