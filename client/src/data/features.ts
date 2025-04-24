import { Feature } from "@/lib/types";

type FeaturesData = {
  [key: string]: Feature[];
};

export const features: FeaturesData = {
  en: [
    {
      id: "offline",
      title: "Offline Access",
      description: "Download lessons for areas with limited connectivity and continue your education without interruptions.",
      bgColorClass: "bg-primary/10",
      textColorClass: "text-primary"
    },
    {
      id: "multilanguage",
      title: "Multi-Language Support",
      description: "Learn in English, French, or Swahili with native-speaking tutors from across the continent.",
      bgColorClass: "bg-secondary/10",
      textColorClass: "text-secondary"
    },
    {
      id: "affordable",
      title: "Affordable Pricing",
      description: "Pay in local currency with flexible options including mobile money and payment plans.",
      bgColorClass: "bg-gold/10",
      textColorClass: "text-gold"
    },
    {
      id: "verified",
      title: "Verified Tutors",
      description: "All our tutors are thoroughly vetted for qualifications, teaching ability and character.",
      bgColorClass: "bg-navy/10",
      textColorClass: "text-navy"
    }
  ],
  fr: [
    {
      id: "offline",
      title: "Accès Hors Ligne",
      description: "Téléchargez des leçons pour les zones à connectivité limitée et poursuivez votre éducation sans interruption.",
      bgColorClass: "bg-primary/10",
      textColorClass: "text-primary"
    },
    {
      id: "multilanguage",
      title: "Support Multilingue",
      description: "Apprenez en anglais, français ou swahili avec des tuteurs natifs de tout le continent.",
      bgColorClass: "bg-secondary/10",
      textColorClass: "text-secondary"
    },
    {
      id: "affordable",
      title: "Prix Abordable",
      description: "Payez en monnaie locale avec des options flexibles, y compris l'argent mobile et les plans de paiement.",
      bgColorClass: "bg-gold/10",
      textColorClass: "text-gold"
    },
    {
      id: "verified",
      title: "Tuteurs Vérifiés",
      description: "Tous nos tuteurs sont soigneusement contrôlés pour leurs qualifications, leur capacité d'enseignement et leur caractère.",
      bgColorClass: "bg-navy/10",
      textColorClass: "text-navy"
    }
  ],
  sw: [
    {
      id: "offline",
      title: "Ufikiaji Nje ya Mtandao",
      description: "Pakua masomo kwa maeneo yenye mawasiliano ya mtandao yaliyopungua na endelea na elimu yako bila vikwazo.",
      bgColorClass: "bg-primary/10",
      textColorClass: "text-primary"
    },
    {
      id: "multilanguage",
      title: "Msaada wa Lugha Nyingi",
      description: "Jifunze kwa Kiingereza, Kifaransa, au Kiswahili na walimu wazawa kutoka bara zima.",
      bgColorClass: "bg-secondary/10",
      textColorClass: "text-secondary"
    },
    {
      id: "affordable",
      title: "Bei Nafuu",
      description: "Lipa kwa fedha za ndani na chaguo nyingi ikiwemo pesa za simu na mipango ya malipo.",
      bgColorClass: "bg-gold/10",
      textColorClass: "text-gold"
    },
    {
      id: "verified",
      title: "Walimu Waliothibitishwa",
      description: "Walimu wetu wote wamechunguzwa kwa makini kwa sifa, uwezo wa kufundisha na tabia.",
      bgColorClass: "bg-navy/10",
      textColorClass: "text-navy"
    }
  ]
};
