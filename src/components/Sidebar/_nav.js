export default {
  items: [
    {
      name: 'Accueil',
      url: '/accueil',
      badge: {
        variant: 'info',
      },
    },
    {
      name: 'Référentiels',
      children: [
        {
          name: 'BCE',
          url: '/referentiel/bce',
        },
        {
          name: 'RNSR',
          url: '/referentiel/rnsr',
        },
        {
          name: 'SIRET',
          url: '/referentiel/siret',
        },
      ],
    },
    {
      name: 'Importer un nouveau fichier',
      url: '/import',
    },
    {
      name: 'Extraire des données',
      url: '/extract',
    },
  ],
};
