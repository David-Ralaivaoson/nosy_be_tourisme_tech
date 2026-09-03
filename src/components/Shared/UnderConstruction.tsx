export default function UnderConstruction({ title }: { title: string }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400">
        Sainte-Marie · Madagascar
      </p>
      <h1 className="text-3xl font-light md:text-5xl">{title}</h1>
      <p className="max-w-md text-white/60">
        Cette section arrive dans la prochaine étape du développement.
      </p>
    </main>
  );
}
