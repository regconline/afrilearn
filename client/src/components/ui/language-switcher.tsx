import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { availableLanguages } from "@/lib/i18n";

interface LanguageSwitcherProps {
  minimal?: boolean;
  mobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  minimal = false,
  mobile = false 
}) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  // Get current language data
  const currentLang = availableLanguages.find(lang => lang.code === language);

  if (mobile) {
    return (
      <div className="px-3 py-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
        <div className="mt-1 flex space-x-2">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center px-2 py-1 rounded text-sm ${
                language === lang.code 
                  ? "bg-cream dark:bg-navy/30" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <img 
                src={lang.flagUrl} 
                alt={lang.name} 
                className="w-4 h-4 mr-1" 
              />
              <span>{lang.shortName}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (minimal) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-sm font-medium text-navy dark:text-cream hover:text-primary focus:outline-none"
          >
            <img 
              src={currentLang?.flagUrl} 
              alt={currentLang?.name} 
              className="w-5 h-5 mr-1" 
            />
            <span>{currentLang?.shortName}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className="flex items-center cursor-pointer"
            >
              <img 
                src={lang.flagUrl} 
                alt={lang.name} 
                className="w-4 h-4 mr-2" 
              />
              <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex space-x-2 items-center">
      <p className="text-sm font-medium">Language:</p>
      {availableLanguages.map((lang, index) => (
        <React.Fragment key={lang.code}>
          <button 
            className={`flex items-center text-sm ${
              language === lang.code 
                ? "text-gold font-medium" 
                : "text-gray-300 hover:text-gold"
            }`}
            onClick={() => setLanguage(lang.code)}
          >
            <img 
              src={lang.flagUrl} 
              alt={lang.name} 
              className="w-5 h-3 mr-1" 
            />
            <span>{lang.name}</span>
          </button>
          {index < availableLanguages.length - 1 && (
            <span className="text-gray-500">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
