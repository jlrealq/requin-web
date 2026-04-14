import { SEOHead } from '../../SEOHead';
import { GoogleAnalytics } from '../../GoogleAnalytics';
import { MarketTicker } from '../../MarketTicker';
import { Navigation } from '../../Navigation';
import { Hero } from '../../Hero';
import { Stats } from '../../Stats';
import { Services } from '../../Services';
import { SegmentsTable } from '../../SegmentsTable';
import { CaseStudies } from '../../CaseStudies';
import { Simulator } from '../../Simulator';
import { TrustBadges } from '../../TrustBadges';
import { Testimonials } from '../../Testimonials';
import { News } from '../../News';
import { AboutUs } from '../../AboutUs';
import { FAQ } from '../../FAQ';
import { ContactForm } from '../../ContactForm';
import { Footer } from '../../Footer';
import { WhatsAppButton } from '../../WhatsAppButton';
import { useState } from 'react';

function App() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  return (
    <>
      <SEOHead />
      <GoogleAnalytics />
      
      <div className="flex flex-col min-h-screen">
        <MarketTicker />
        <Navigation onSimulatorClick={() => setIsSimulatorOpen(true)} />
        
        <main className="flex-grow">
          <Hero />
          <Stats />
          <Services />
          <SegmentsTable />
          <CaseStudies />
          <Simulator isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
          <TrustBadges />
          <Testimonials />
          <News />
          <AboutUs />
          <FAQ />
          <ContactForm />
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}

export default App;
