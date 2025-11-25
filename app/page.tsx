import HeroSection  from '@/components/HomePage/HeroSection';
import HowItWorks from '@/components/HomePage/HowItWorks';
import TrustedBy from '@/components/HomePage/TrustedBy';
import Testimonials from '@/components/HomePage/Testimonials';
import Features from '@/components/HomePage/Features';
import ProductDemo from '@/components/HomePage/ProductDemo';
import FAQ from '@/components/HomePage/FAQ';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <Features />
      <ProductDemo />
      <Testimonials />
      <FAQ />
    </main>
  );
}
