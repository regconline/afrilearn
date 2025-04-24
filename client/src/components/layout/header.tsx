import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-primary dark:text-white font-poppins font-bold text-xl">
                AfriLearn
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#how-it-works" className="text-navy dark:text-gray-300 hover:text-primary font-medium">
              {t("header.howItWorks")}
            </Link>
            <Link href="#find-tutors" className="text-navy dark:text-gray-300 hover:text-primary font-medium">
              {t("header.findTutors")}
            </Link>
            <Link href="#become-tutor" className="text-navy dark:text-gray-300 hover:text-primary font-medium">
              {t("header.becomeTutor")}
            </Link>
            <Link href="#resources" className="text-navy dark:text-gray-300 hover:text-primary font-medium">
              {t("header.resources")}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:block relative">
              <LanguageSwitcher minimal />
            </div>

            {/* Login/Sign Up Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" className="hidden sm:inline-flex border-primary text-primary hover:bg-primary hover:text-white">
                {t("header.login")}
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">
                {t("header.signup")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white dark:bg-gray-800 py-2 border-t ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link 
            href="#how-it-works"
            className="block px-3 py-2 rounded-md text-base font-medium text-navy dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("header.howItWorks")}
          </Link>
          <Link 
            href="#find-tutors"
            className="block px-3 py-2 rounded-md text-base font-medium text-navy dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("header.findTutors")}
          </Link>
          <Link
            href="#become-tutor"
            className="block px-3 py-2 rounded-md text-base font-medium text-navy dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("header.becomeTutor")}
          </Link>
          <Link
            href="#resources"
            className="block px-3 py-2 rounded-md text-base font-medium text-navy dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("header.resources")}
          </Link>
          
          <div className="flex space-x-2 px-3 py-2">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              {t("header.login")}
            </Button>
            <Button className="w-full bg-primary text-white hover:bg-primary/90">
              {t("header.signup")}
            </Button>
          </div>
          
          <LanguageSwitcher mobile />
        </div>
      </div>
    </header>
  );
};

export default Header;
