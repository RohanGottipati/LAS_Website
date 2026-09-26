import React, { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { Impact } from './components/Impact';
import { Initiatives } from './components/Initiatives';
import { Team } from './components/Team';
import { Datathon } from './components/Datathon';
import { Sponsors } from './components/Sponsors';
import { Faq } from './components/Faq';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

type AsciiDensity = 'fine' | 'standard' | 'bold';

const DENSITY: Record<AsciiDensity, {w: number;h: number;}> = {
  fine: { w: 7, h: 11 },
  standard: { w: 9, h: 14 },
  bold: { w: 13, h: 19 }
};

interface AppProps {
  asciiDensity?: AsciiDensity;
  showSponsors?: boolean;
}

export function App({ asciiDensity = 'standard', showSponsors = true }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const cell = DENSITY[asciiDensity];

  return (
    <div className="min-h-screen w-full bg-ink font-heading text-paper antialiased">
      <Nav />
      <main>
        <Hero cellWidth={cell.w} cellHeight={cell.h} />
        <About />
        <Stats />
        <Impact />
        <Initiatives />
        <Team />
        <Datathon cellWidth={cell.w + 1} cellHeight={cell.h + 1} />
        {showSponsors ? <Sponsors /> : null}
        <Faq />
        <Newsletter cellWidth={cell.w} cellHeight={cell.h} />
      </main>
      <Footer />
    </div>);

}