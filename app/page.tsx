import HeroSection from '@/components/home/HeroSection';
import Navbar from '@/components/layout/Navbar';
import ProblemSolution from '@/components/home/ProblemSolution';
import HowItWorks from '@/components/home/HowItWorks';
import FeatureHighlights from '@/components/home/FeatureHighlights';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <ProblemSolution />
        <HowItWorks />
        <FeatureHighlights />
        <Testimonials />
        <CtaSection />
        <Footer />
      </main>
    </ThemeProvider>
  );
}