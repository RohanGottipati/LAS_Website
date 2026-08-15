import { useCallback, useEffect, useState } from 'react'
import { SitePreloader } from './components/SitePreloader'
import { GlobalHeader } from './components/GlobalHeader'
import { Hero } from './components/Hero'
import { ToolsBridge } from './components/ToolsBridge'
import { EcosystemGrid } from './components/EcosystemGrid'
import { FrameworkScene } from './components/FrameworkScene'
import { FloatingGallery } from './components/FloatingGallery'
import { ImpactStats } from './components/ImpactStats'
import { JoinCta } from './components/JoinCta'
import { TeamEditorial } from './components/TeamEditorial'
import { FaqSection } from './components/FaqSection'
import { FinaleCta } from './components/FinaleCta'
import { SiteFooter } from './components/SiteFooter'
import { refreshScrollTriggersWhenSettled } from './lib/motion'

function App() {
  // `revealing` starts the hero choreography while the loader mask is still
  // opening; `loaded` retires the loader from the tree.
  const [revealing, setRevealing] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleReveal = useCallback(() => setRevealing(true), [])
  const handleComplete = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    refreshScrollTriggersWhenSettled()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {!loaded && <SitePreloader onReveal={handleReveal} onComplete={handleComplete} />}

      <GlobalHeader revealed={revealing} />

      <main id="main">
        <Hero start={revealing} />
        <ToolsBridge />
        <EcosystemGrid />
        <FrameworkScene />
        <FloatingGallery />
        <ImpactStats />
        <JoinCta />
        <TeamEditorial />
        <FaqSection />
        <FinaleCta />
      </main>

      <SiteFooter />
    </>
  )
}

export default App
