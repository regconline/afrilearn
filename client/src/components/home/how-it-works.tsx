import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="py-16 bg-cream dark:bg-gray-800" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2 z-0"></div>
          
          <div className="space-y-16 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">{t("howItWorks.step1.title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {t("howItWorks.step1.description")}
                  </p>
                  <a href="#" className="text-primary font-medium flex items-center justify-end">
                    <span>{t("howItWorks.step1.cta")}</span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12 md:flex md:items-center">
                <img 
                  src="https://images.unsplash.com/photo-1515115041507-4a4ee3170b52?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Student creating profile" 
                  className="rounded-lg shadow-lg object-cover h-64 w-full md:w-auto"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 order-2 md:order-1 md:flex md:items-center md:justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Finding tutors on device" 
                  className="rounded-lg shadow-lg object-cover h-64 w-full md:w-auto"
                />
              </div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">{t("howItWorks.step2.title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {t("howItWorks.step2.description")}
                  </p>
                  <a href="#" className="text-secondary font-medium flex items-center">
                    <span>{t("howItWorks.step2.cta")}</span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">{t("howItWorks.step3.title")}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {t("howItWorks.step3.description")}
                  </p>
                  <a href="#" className="text-primary font-medium flex items-center justify-end">
                    <span>{t("howItWorks.step3.cta")}</span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <div className="md:w-1/2 md:pl-12 md:flex md:items-center">
                <img 
                  src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Online tutoring session" 
                  className="rounded-lg shadow-lg object-cover h-64 w-full md:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
