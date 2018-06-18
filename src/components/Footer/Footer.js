import React from 'react';
import Mesri from '../../../public/img/MENESR_H.svg';
import Eig from '../../../public/img/eig.svg';

const Footer = () => (
  <footer className="app-footer d-flex justify-content-between">
    <a href="http://www.enseignementsup-recherche.gouv.fr/" className="mx-2">
      <img src={Mesri} alt="Logo MESRI" width="230px" />
    </a>
    <a href="https://entrepreneur-interet-general.etalab.gouv.fr/" className="mx-2">
      <img src={Eig} alt="Logo EIG" width="230px" />
    </a>
  </footer>
);

export default Footer;
