export interface Feature {
  id: string;
  title: string;
  description: string;
  bgColorClass: string;
  textColorClass: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
  result: string;
  bgColorClass: string;
  textColorClass: string;
  resultTextClass: string;
}

export interface Language {
  code: string;
  name: string;
  shortName: string;
  flagUrl: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
