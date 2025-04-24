import { ArrowRight, Check, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="relative bg-cream dark:bg-gray-900">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')` 
      }}></div>
      <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              {t("hero.findTutor")}
            </Button>
            <Button size="lg" variant="outline" className="border-gold text-navy dark:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800">
              {t("hero.startTeaching")}
            </Button>
          </div>
          <div className="mt-6 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>{t("hero.joinStudents")}</span>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="African students learning together" 
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent flex items-end">
              <div className="p-4 sm:p-6">
                <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-4 backdrop-blur-sm max-w-md">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                      DA
                    </div>
                    <div className="ml-3">
                      <h3 className="text-navy dark:text-white font-semibold">Daniel Adeyemi</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Math & Physics Tutor</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-navy dark:text-white ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t("hero.tutorQuote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
