import { Globe } from "@/components/magicui/globe";

export function GlobeUI() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border bg-background">
      <div className="relative z-10 flex flex-col items-center gap-y-6 px-4 text-center">
        <h1 className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-5xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400 md:text-7xl">
          Unleash Your Creativity
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Discover the most powerful and intuitive AI image generator on the planet. Turn your ideas into stunning visuals in seconds.
        </p>
        <button className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition-transform duration-300 ease-in-out hover:scale-105">
          Get Started for Free
        </button>
      </div>
      <Globe className="top-1/2 -translate-y-1/2" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}