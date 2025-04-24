import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { features } from "@/data/features";
import { Clock, MessageSquare, CreditCard, Shield } from "lucide-react";

const FeatureIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "offline":
      return <Clock className="h-8 w-8 text-primary" />;
    case "multilanguage":
      return <MessageSquare className="h-8 w-8 text-secondary" />;
    case "affordable":
      return <CreditCard className="h-8 w-8 text-gold" />;
    case "verified":
      return <Shield className="h-8 w-8 text-navy" />;
    default:
      return <Clock className="h-8 w-8 text-primary" />;
  }
};

const FeaturesSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);
  
  const currentFeatures = features[language] || features.en;

  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">
            {t("features.title")}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-cream dark:bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 ${feature.bgColorClass} rounded-full flex items-center justify-center mb-4`}>
                <FeatureIcon name={feature.id} />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
