import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const CTASection = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              {t("cta.signupButton")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              {t("cta.demoButton")}
              <Play className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/70">
            {t("cta.noCreditCard")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
