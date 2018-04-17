export default {
  items: [{
    name: 'Etablissements',
    url: '/etablissements',
  },
  {
    name: 'Catégories',
    url: '/categories',
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
