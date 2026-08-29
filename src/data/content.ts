// Contenu partagé entre les 3 maquettes comparatives (Nike / Tesla / Vercel).
// Copywriting retravaillé à partir de reference/content-inventory.md (site actuel).

export const nav = [
  { label: 'Entretien', href: '/entretien' },
  { label: 'Réparation', href: '/reparation' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const hero = {
  headline: 'Vos ergomètres Concept 2, toujours prêts à performer',
  subheadline:
    'Entretien, réparation et nettoyage de vos RowErg, SkiErg, BikeErg et barres olympiques, directement dans votre salle. Intervention sous 48h, devis gratuit.',
  ctaPrimary: 'Demander une intervention',
  ctaSecondary: 'Voir nos services',
};

export const services = [
  {
    title: 'Entretien Concept 2',
    description:
      'Nettoyage complet, lubrification et remplacement des pièces d\'usure pour RowErg, SkiErg et BikeErg.',
    icon: 'ph:wrench',
  },
  {
    title: 'Barres et haltères',
    description:
      'Démontage intégral, nettoyage des roulements à aiguilles, traitement anti-rouille et lubrification, toutes marques.',
    icon: 'ph:barbell',
  },
  {
    title: 'Audit et planification',
    description:
      'Diagnostic complet de votre parc machines et calendrier de maintenance préventive sur mesure.',
    icon: 'ph:clipboard-text',
  },
];

export const serviceTag = 'Devis gratuit · Réponse sous 24h';

export const equipment = [
  'RowErg',
  'SkiErg',
  'BikeErg',
  'Assault AirBike',
  'Rogue EchoBike',
];

export const faq = [
  {
    question: 'Comment se déroule une intervention ?',
    answer:
      'Vous nous contactez, nous vous envoyons un devis gratuit sous 24h. L\'intervention a lieu sous 48h dans votre salle, idéalement en heures creuses, avec tout le matériel nécessaire sur place.',
  },
  {
    question: 'Travaillez-vous uniquement sur Concept 2 ?',
    answer:
      'Notre spécialité, ce sont les ergomètres Concept 2 (RowErg, SkiErg, BikeErg). Nous intervenons aussi sur les barres et haltères, toutes marques confondues.',
  },
  {
    question: 'Proposez-vous un contrat d\'entretien régulier ?',
    answer:
      'Oui, en plus des interventions ponctuelles, nous proposons des contrats de maintenance préventive sur demande.',
  },
  {
    question: 'Quelles zones couvrez-vous ?',
    answer:
      'Toute l\'Île-de-France : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d\'Oise (95).',
  },
];

export const contact = {
  phone: '07 64 02 74 44',
  phoneHref: 'tel:+33764027444',
  email: 'contact@ergoliftmaintenance.com',
  responseTime: 'Réponse sous 48h',
};

export const serviceArea = [
  'Paris (75)',
  'Seine-et-Marne (77)',
  'Yvelines (78)',
  'Essonne (91)',
  'Hauts-de-Seine (92)',
  'Seine-Saint-Denis (93)',
  'Val-de-Marne (94)',
  "Val-d'Oise (95)",
];

// TODO: remplacer par le texte réel de l'avis Google une fois fourni.
export const testimonial = {
  pending: true,
  quote: '',
  author: '',
  source: 'Avis Google',
};

export const social = {
  instagram: '#',
  linkedin: '#',
  googleReview: '#',
};

export const legal = {
  companyName: 'Ergo&Lift Maintenance',
  owner: 'Thoralin Enzo',
  siret: '927 952 283 00038',
  taxNote: 'Micro-entreprise non assujettie à la TVA — Article 293 B du CGI',
  copyright: '© 2026 Ergo&Lift Maintenance. Tous droits réservés.',
};
