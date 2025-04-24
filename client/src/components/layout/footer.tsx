import { Link } from "wouter";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-white font-poppins font-bold text-xl">AfriLearn</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              {t("footer.description")}
            </p>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li><Link href="#find-tutor" className="text-gray-300 hover:text-gold">{t("footer.findTutor")}</Link></li>
              <li><Link href="#become-tutor" className="text-gray-300 hover:text-gold">{t("footer.becomeTutor")}</Link></li>
              <li><Link href="#how-it-works" className="text-gray-300 hover:text-gold">{t("footer.howItWorks")}</Link></li>
              <li><Link href="#pricing" className="text-gray-300 hover:text-gold">{t("footer.pricing")}</Link></li>
              <li><Link href="#student-resources" className="text-gray-300 hover:text-gold">{t("footer.studentResources")}</Link></li>
              <li><Link href="#tutor-resources" className="text-gray-300 hover:text-gold">{t("footer.tutorResources")}</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t("footer.aboutUs")}</h3>
            <ul className="space-y-2">
              <li><Link href="#mission" className="text-gray-300 hover:text-gold">{t("footer.mission")}</Link></li>
              <li><Link href="#team" className="text-gray-300 hover:text-gold">{t("footer.team")}</Link></li>
              <li><Link href="#careers" className="text-gray-300 hover:text-gold">{t("footer.careers")}</Link></li>
              <li><Link href="#press" className="text-gray-300 hover:text-gold">{t("footer.press")}</Link></li>
              <li><Link href="#blog" className="text-gray-300 hover:text-gold">{t("footer.blog")}</Link></li>
              <li><Link href="#contact" className="text-gray-300 hover:text-gold">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          {/* Payment & Connect */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t("footer.connectWithUs")}</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="text-gray-300 hover:text-gold" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">{t("footer.paymentMethods")}</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 px-3 py-2 rounded text-sm font-medium">
                M-Pesa
              </div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm font-medium">
                Flutterwave
              </div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm font-medium">
                Airtel Money
              </div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm font-medium">
                Visa
              </div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm font-medium">
                Mastercard
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AfriLearn. {t("footer.allRightsReserved")}
            </p>
            <div className="flex flex-wrap space-x-6">
              <Link href="#privacy" className="text-sm text-gray-400 hover:text-white">{t("footer.privacyPolicy")}</Link>
              <Link href="#terms" className="text-sm text-gray-400 hover:text-white">{t("footer.termsOfService")}</Link>
              <Link href="#cookies" className="text-sm text-gray-400 hover:text-white">{t("footer.cookies")}</Link>
              <Link href="#accessibility" className="text-sm text-gray-400 hover:text-white">{t("footer.accessibility")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
