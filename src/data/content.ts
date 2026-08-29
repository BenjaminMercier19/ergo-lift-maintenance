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

export const pricing = {
  cleaning: '80 € / machine',
  repair: '80 € / heure',
  audit: 'Sur devis',
  delay: 'Sous 48h',
};

export const entretienPage = {
  heading: 'Entretien préventif, sur site',
  intro:
    'Un ergomètre entretenu régulièrement dure plus longtemps et tombe moins souvent en panne. On s\'occupe du nettoyage, de la lubrification et du contrôle de vos machines directement dans votre salle.',
  includes: [
    {
      title: 'RowErg, SkiErg, BikeErg',
      description: 'Nettoyage intégral, lubrification de la chaîne et du volant, contrôle du moniteur PM5.',
      icon: 'ph:wrench',
    },
    {
      title: 'Barres et haltères',
      description: 'Nettoyage des roulements à aiguilles, traitement et prévention anti-rouille, toutes marques.',
      icon: 'ph:barbell',
    },
    {
      title: 'Audit et calendrier de maintenance',
      description: 'Diagnostic complet de votre parc machines et calendrier d\'entretien préventif adapté à votre fréquentation.',
      icon: 'ph:clipboard-text',
    },
  ],
};

export const reparationPage = {
  heading: 'Une panne ? On intervient sous 48h',
  intro:
    'Corde effilochée, roulement grippé, frein à air bruyant : on diagnostique et on répare vos équipements sur place, sans les faire sortir de votre salle.',
  includes: [
    {
      title: 'Diagnostic gratuit',
      description: 'On identifie la panne et on vous envoie un devis avant toute intervention.',
      icon: 'ph:magnifying-glass',
    },
    {
      title: 'Remplacement de pièces',
      description: 'Cordes, roulements, poignées, freins à air : remplacement des pièces d\'usure sur place.',
      icon: 'ph:gear',
    },
    {
      title: 'Intervention rapide',
      description: 'Réparation sous 48h après confirmation du devis, en heures creuses si besoin.',
      icon: 'ph:clock-countdown',
    },
  ],
};

export const equipment = [
  'RowErg',
  'SkiErg',
  'BikeErg',
  'Assault AirBike',
  'Rogue EchoBike',
];

export const equipmentModels = [
  { label: 'RowErg', glb: '/models/rowerg.glb' },
  { label: 'SkiErg', glb: '/models/skierg.glb' },
  { label: 'BikeErg', glb: '/models/bikeerg.glb' },
  { label: 'Assault AirBike', glb: '/models/assault-airbike.glb' },
  { label: 'Rogue EchoBike', glb: '/models/rogue-airbike.glb' },
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
  instagram: 'https://www.instagram.com/ergoliftmaintenance',
  linkedin: 'https://www.linkedin.com/company/ergo-lift-maintenance',
  googleReview: '#',
};

export const legal = {
  companyName: 'Ergo&Lift Maintenance',
  owner: 'Thoralin Enzo',
  siret: '927 952 283 00038',
  siren: '927 952 283',
  taxNote: 'Micro-entreprise non assujettie à la TVA (article 293 B du CGI).',
  hosting: {
    name: 'Netlify, Inc.',
    address: '512 2nd Street, Suite 200, San Francisco, CA 94107, USA',
  },
  copyright: '© 2026 Ergo&Lift Maintenance. Tous droits réservés.',
};

export const cgvSections = [
  {
    title: 'Objet et champ d\'application',
    body: 'Les présentes conditions générales de vente gouvernent tous les contrats de service entre Ergo&Lift Maintenance et ses clients. Passer commande implique l\'adhésion sans réserve à ces conditions.',
  },
  {
    title: 'Prestations proposées',
    body: 'Entretien des ergomètres Concept 2, réparation de pièces, entretien de barres olympiques et haltères (toutes marques), audits techniques et contrats personnalisés. Tous les travaux s\'effectuent sur site en Île-de-France.',
  },
  {
    title: 'Tarifs et conditions financières',
    body: `Nettoyage ergomètre : ${pricing.cleaning}. Réparation : ${pricing.repair}. Audit et contrat annuel : ${pricing.audit}. Délai d'intervention : ${pricing.delay}. La structure bénéficie d'une exemption de TVA en tant que micro-entreprise.`,
  },
  {
    title: 'Commande et confirmation',
    body: 'Les demandes peuvent être soumises par téléphone ou par email à contact@ergoliftmaintenance.com.',
  },
  {
    title: 'Exécution des prestations',
    body: 'L\'intervention a lieu sous 48h suivant confirmation du devis. Le client doit assurer un accès sécurisé aux équipements et être présent lors de l\'intervention.',
  },
  {
    title: 'Paiement',
    body: 'Paiements acceptés : virement, chèque ou espèces (sous 1000 €). Tout retard de paiement entraîne des pénalités au taux de 3 fois le taux d\'intérêt légal, plus une indemnité forfaitaire de 40 €.',
  },
  {
    title: 'Annulation',
    body: 'Toute annulation doit être notifiée avec un préavis minimum de 24 heures. Une annulation tardive et injustifiée peut entraîner une pénalité de 80 €.',
  },
  {
    title: 'Responsabilités',
    body: 'Le prestataire décline toute responsabilité concernant l\'usure naturelle des équipements, les dommages postérieurs à l\'intervention dus à une mauvaise utilisation, ou les préjudices indirects.',
  },
  {
    title: 'Données personnelles',
    body: 'Les données transmises dans le cadre d\'une demande de devis ou d\'intervention sont traitées conformément au RGPD.',
  },
  {
    title: 'Droit applicable',
    body: 'Les présentes CGV relèvent du droit français. En cas de litige, les tribunaux de Paris sont seuls compétents.',
  },
];
