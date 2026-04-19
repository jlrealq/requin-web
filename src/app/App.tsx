import { useState } from 'react';
import { SEOHead } from '../../SEOHead';
import { GoogleAnalytics } from '../../GoogleAnalytics';
import { MarketTicker } from '../../MarketTicker';
import { Navigation } from '../../Navigation';
import { Hero } from '../../Hero';
import { Stats } from '../../Stats';
import { AboutUs } from '../../AboutUs';
import { SegmentsTable } from '../../SegmentsTable';
import { Services } from '../../Services';
import { TrustBadges } from '../../TrustBadges';
import { Testimonials } from '../../Testimonials';
import { CaseStudies } from '../../CaseStudies';
import { Simulator } from '../../Simulator';
import { News } from '../../News';
import { FAQ } from '../../FAQ';
import { ContactForm } from '../../ContactForm';
import { Footer } from '../../Footer';
import { TelegramButton } from '../../TelegramButton';
import { WhatsAppButton } from '../../WhatsAppButton';
import { Calculator } from 'lucide-react';


export default function App() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EFEDE8] text-[#1A1A1A]">
      <SEOHead />
      <GoogleAnalytics />

      <MarketTicker />
      <Navigation onSimulatorClick={() => setSimulatorOpen(true)} />
      <Hero onSimulatorClick={() => setSimulatorOpen(true)} />

      <section className="py-12 bg-[#1A1A1A] text-[#EFEDE8] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light leading-relaxed italic opacity-90">
            "Ayudamos a pymes en crecimiento, holdings familiares, startups y empresas que preparan su expansión a España y otros mercados, diseñando estructuras financieras y legales que minimizan impuestos, riesgos y fricciones operativas."
          </p>
        </div>
      </section>

      <AboutUs />
      <Stats />
      <SegmentsTable />
      <Services />
      <TrustBadges />
      <Testimonials />
      <CaseStudies />
      <News />
      <FAQ />
      <ContactForm />
      <Footer />


      <TelegramButton />
      <WhatsAppButton />
      <Simulator isOpen={simulatorOpen} onClose={() => setSimulatorOpen(false)} />
    </div>
  );
}
