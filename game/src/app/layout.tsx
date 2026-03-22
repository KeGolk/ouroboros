import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crowns of Ash — A Game of Thrones & Treachery',
  description:
    'A branching narrative RPG of political intrigue, war, and betrayal in a dark medieval world.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1b1e',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased flex flex-col scrollbar-dark">
        {/* Top ornate border */}
        <header className="sticky top-0 z-50 border-b border-parchment-800/30 bg-shadow-950/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="text-gold-500 text-lg" aria-hidden="true">
                ⚔
              </span>
              <h1 className="font-display text-lg tracking-wider text-parchment-200 sm:text-xl">
                Crowns of Ash
              </h1>
            </div>
            <nav className="hidden items-center gap-6 sm:flex">
              <span className="font-display text-xs uppercase tracking-widest text-parchment-500 hover:text-gold-400 transition-colors cursor-pointer">
                Journal
              </span>
              <span className="font-display text-xs uppercase tracking-widest text-parchment-500 hover:text-gold-400 transition-colors cursor-pointer">
                Character
              </span>
              <span className="font-display text-xs uppercase tracking-widest text-parchment-500 hover:text-gold-400 transition-colors cursor-pointer">
                World Map
              </span>
            </nav>
          </div>
          <div className="divider-ornate" />
        </header>

        {/* Main content area */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-parchment-800/20 bg-shadow-950/80">
          <div className="divider-ornate" />
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center font-body text-xs text-parchment-700">
              &ldquo;When you play the game of thrones, you win or you die.&rdquo;
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
