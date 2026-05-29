import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-animated-gradient flex flex-col items-center justify-center text-center px-4">
      <p className="font-script text-8xl text-primary mb-4">404</p>
      <p className="font-serif text-2xl text-foreground/70 italic mb-8">This page doesn't exist… but our love does. ❤️</p>
      <button
        onClick={() => setLocation("/")}
        className="glass-card rounded-full px-8 py-4 font-serif text-primary hover:scale-105 transition-transform"
      >
        Take me home
      </button>
    </div>
  );
}