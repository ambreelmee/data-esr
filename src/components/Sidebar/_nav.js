export default {
  items: [{
    name: 'Etablissements',
    icon: 'fa fa-graduation-cap',
    children: [
      {
        name: 'Recherche',
        url: '/etablissements',
        icon: 'fa fa-home',
        class: 'pl-3',
      },
      {
        name: 'Mises à jour',
        url: '/etablissements/mises-a-jour',
        icon: 'fa fa-bell',
        class: 'pl-3',
        badge: {
          variant: 'danger',
          text: 'new',
        },
      },
      {
        name: 'Nomenclatures',
        url: '/etablissements/admin',
        icon: 'fa fa-wrench',
        class: 'pl-3',
      }],
  },
  {
    name: 'Entreprises',
    icon: 'fa fa-industry',
    children: [
      {
        name: 'Recherche',
        url: '/entreprises',
        icon: 'fa fa-home',
        class: 'pl-3',
      },
      {
        name: 'Mises à jour',
        url: '/entreprises/mises-a-jour',
        icon: 'fa fa-bell',
        class: 'pl-3',
        badge: {
          variant: 'danger',
          text: 'new',
        },
      },
      {
        name: 'Nomenclatures',
        url: '/entreprises/admin',
        icon: 'fa fa-wrench',
        class: 'pl-3',
      }],
  }],
};
