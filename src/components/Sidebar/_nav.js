export default {
  items: [{
    name: 'Etablissements',
    icon: 'fa fa-graduation-cap',
    children: [
      {
        name: 'Accueil',
        url: '/etablissements',
        icon: 'fa fa-home',
        class: 'pl-3',
      },
      {
        name: 'Mises à jour',
        url: '/mises-a-jour',
        icon: 'fa fa-bell',
        class: 'pl-3',
        badge: {
          variant: 'danger',
          text: 'new',
        },
      },
      {
        name: 'Admin',
        url: '/admin',
        icon: 'icon-settings"',
        class: 'pl-3',
      }],
  }],
};
