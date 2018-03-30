export default {
  items: [{
    name: 'Dashboard',
    url: '/dashboard',
  },
  {
    name: 'Etablissements',
    url: '/etablissements',
  },
  {
    name: 'Mise à jour des référentiels',
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
    name: 'Interaction avec la base',
    url: '/database',
    children: [
      {
        name: 'Importer des données',
        url: '/database/import',
      },
      {
        name: 'Extraire des données',
        url: '/database/extract',
      },
    ],
  }],
};
