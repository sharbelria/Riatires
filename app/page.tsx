import { Hero } from "@/components/home/hero";
import { BrandsGrid, HowItWorks, Testimonials, TrustBlocks } from "@/components/home/sections";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBlocks />
      <HowItWorks />
      <BrandsGrid />
      <Testimonials />
      <ContactSection />
    </>
  );
}
