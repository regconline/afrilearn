import { Testimonial } from "@/lib/types";

type TestimonialsData = {
  [key: string]: Testimonial[];
};

export const testimonials: TestimonialsData = {
  en: [
    {
      id: "lucy-kimani",
      name: "Lucy Kimani",
      role: "Student, Nairobi",
      initials: "LK",
      quote: "AfriLearn helped me improve my math grades dramatically. I can download lessons and study even when our internet is down. My tutor adapts to my learning pace perfectly.",
      rating: 5,
      result: "Improved grades by 30% in 3 months",
      bgColorClass: "bg-primary/20",
      textColorClass: "text-primary",
      resultTextClass: "text-primary"
    },
    {
      id: "james-okafor",
      name: "James Okafor",
      role: "Math Tutor, Lagos",
      initials: "JO",
      quote: "As a tutor, AfriLearn has doubled my income and allows me to reach students across West Africa. The platform handles payments and scheduling so I can focus on teaching.",
      rating: 5,
      result: "Now teaching 30+ students across 5 countries",
      bgColorClass: "bg-secondary/20",
      textColorClass: "text-secondary",
      resultTextClass: "text-secondary"
    },
    {
      id: "rose-mutua",
      name: "Rose Mutua",
      role: "Parent, Kampala",
      initials: "RM",
      quote: "I can finally afford quality tutoring for my children. The mobile money payment options make it accessible, and I love the progress reports that show exactly what they're learning.",
      rating: 4,
      result: "Children now excited about learning",
      bgColorClass: "bg-navy/20",
      textColorClass: "text-navy",
      resultTextClass: "text-navy"
    }
  ],
  fr: [
    {
      id: "lucy-kimani",
      name: "Lucy Kimani",
      role: "Élève, Nairobi",
      initials: "LK",
      quote: "AfriLearn m'a aidé à améliorer considérablement mes notes en mathématiques. Je peux télécharger des leçons et étudier même lorsque notre internet est en panne. Mon tuteur s'adapte parfaitement à mon rythme d'apprentissage.",
      rating: 5,
      result: "Notes améliorées de 30% en 3 mois",
      bgColorClass: "bg-primary/20",
      textColorClass: "text-primary",
      resultTextClass: "text-primary"
    },
    {
      id: "james-okafor",
      name: "James Okafor",
      role: "Tuteur de mathématiques, Lagos",
      initials: "JO",
      quote: "En tant que tuteur, AfriLearn a doublé mes revenus et me permet d'atteindre des étudiants dans toute l'Afrique de l'Ouest. La plateforme gère les paiements et la planification afin que je puisse me concentrer sur l'enseignement.",
      rating: 5,
      result: "Enseigne maintenant à plus de 30 étudiants dans 5 pays",
      bgColorClass: "bg-secondary/20",
      textColorClass: "text-secondary",
      resultTextClass: "text-secondary"
    },
    {
      id: "rose-mutua",
      name: "Rose Mutua",
      role: "Parent, Kampala",
      initials: "RM",
      quote: "Je peux enfin me permettre un tutorat de qualité pour mes enfants. Les options de paiement mobile le rendent accessible, et j'adore les rapports de progression qui montrent exactement ce qu'ils apprennent.",
      rating: 4,
      result: "Les enfants sont maintenant enthousiastes à l'idée d'apprendre",
      bgColorClass: "bg-navy/20",
      textColorClass: "text-navy",
      resultTextClass: "text-navy"
    }
  ],
  sw: [
    {
      id: "lucy-kimani",
      name: "Lucy Kimani",
      role: "Mwanafunzi, Nairobi",
      initials: "LK",
      quote: "AfriLearn imenisaidia kuboresha alama zangu za hesabu sana. Ninaweza kupakua masomo na kusoma hata wakati mtandao wetu umekatika. Mwalimu wangu ananipatia masomo kulingana na kasi yangu ya kujifunza.",
      rating: 5,
      result: "Alama zimeboreshwa kwa 30% kwa miezi 3",
      bgColorClass: "bg-primary/20",
      textColorClass: "text-primary",
      resultTextClass: "text-primary"
    },
    {
      id: "james-okafor",
      name: "James Okafor",
      role: "Mwalimu wa Hesabu, Lagos",
      initials: "JO",
      quote: "Kama mwalimu, AfriLearn imeongeza mapato yangu mara mbili na inaniwezesha kufundisha wanafunzi katika Afrika Magharibi. Jukwaa hili linashughulikia malipo na ratiba ili niweze kulenga kufundisha.",
      rating: 5,
      result: "Sasa anafundisha wanafunzi 30+ katika nchi 5",
      bgColorClass: "bg-secondary/20",
      textColorClass: "text-secondary",
      resultTextClass: "text-secondary"
    },
    {
      id: "rose-mutua",
      name: "Rose Mutua",
      role: "Mzazi, Kampala",
      initials: "RM",
      quote: "Mwishowe ninaweza kumudu mafunzo ya ubora kwa watoto wangu. Chaguo za malipo ya simu zinazofanya iwezekane, na napenda ripoti za maendeleo zinazoonyesha kile wanachojifunza.",
      rating: 4,
      result: "Watoto sasa wana shauku ya kujifunza",
      bgColorClass: "bg-navy/20",
      textColorClass: "text-navy",
      resultTextClass: "text-navy"
    }
  ]
};
