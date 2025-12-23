import Banner from "@/components/home/Banner";
import ServiceOverview from "@/components/home/ServiceOverview";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";

export const metadata = {
  title: "Care.xyz | Professional Home Care Services",
  description: "Reliable and trusted care for children, elderly, and family members.",
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Banner />
      <div id="services">
        <ServiceOverview />
      </div>
      <AboutSection />
      <Testimonials />
    </div>
  );
}