import Header from '@/components/header';
import Hero from '@/components/hero';
import AdvantagesSection from '@/components/advantages-section';
import Footer from '@/components/footer';
import CookieBanner from '@/banner-cookie';
import { FeaturedBusinessesAndFestival } from '@/components/featured-businesses-and-festival';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedBusinessesAndFestival />
      <AdvantagesSection />
      <Footer />
      <CookieBanner />
    </main>
  );
}
