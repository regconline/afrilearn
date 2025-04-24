import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/lib/i18n";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => translate(language, key);
  
  const currentTestimonials = testimonials[language] || testimonials.en;

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < rating ? "text-gold" : "text-gray-300"}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-cream dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${testimonial.bgColorClass} rounded-full flex items-center justify-center ${testimonial.textColorClass} font-bold`}>
                  {testimonial.initials}
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-navy dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {testimonial.quote}
              </p>
              <p className={`text-sm ${testimonial.resultTextClass} font-medium`}>
                {testimonial.result}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="border-gold text-navy dark:text-gray-200 hover:bg-cream dark:hover:bg-gray-800"
          >
            {t("testimonials.readMore")}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
