import { useTheme } from "@/components/ui/theme-provider";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      
      {/* Dark Mode Toggle Button (Fixed Position) */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 bg-navy dark:bg-gray-700 text-white p-3 rounded-full shadow-lg z-40 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </Button>
    </>
  );
};

export default HomePage;
