import React from 'react';

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Table } from 'reactstrap';

const Update = () => (
  <div className="animated fadeIn">
    <Row>
      <Col>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify" /> Mise à jour nécessaire
          </CardHeader>
          <CardBody>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Id_esr</th>
                  <th>Nom</th>
                  <th>Champ modifié</th>
                  <th>Ancienne valeur source</th>
                  <th>Nouvelle valeur source</th>
                  <th>Valeur actuelle base </th>
                  <th>Action </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BCE</td>
                  <td>123</td>
                  <td>Centrale Paris</td>
                  <td>Date de fermeture</td>
                  <td />
                  <td>2018/06/20</td>
                  <td />
                  <td>
                    <Button className="m-1" size="sm" color="success">Approuver la mise à jour</Button>
                    <Button className="m-1" size="sm" color="danger">Rejeter</Button>
                    <Button className="m-1" size="sm" color="secondary">Editer le champ</Button>
                    <Button className="m-1" size="sm" color="primary">Voir la fiche établissement</Button>
                  </td>
                </tr>
                <tr>
                  <td>BCE</td>
                  <td>124</td>
                  <td>CentraleSupelec</td>
                  <td>Adresse</td>
                  <td>Grande voie des Vignes, 92290 Chatenay-Malabry</td>
                  <td>3 rue Joliot Curry, 91190 Gif-sur-Yvette</td>
                  <td>5 Avenue Sully Prudhomme, 92290 Chatenay-Malabry</td>
                  <td>
                    <Button className="m-1" size="sm" color="success">Approuver la mise à jour</Button>
                    <Button className="m-1" size="sm" color="danger">Rejeter</Button>
                    <Button className="m-1" size="sm" color="secondary">Editer le champ</Button>
                    <Button className="m-1" size="sm" color="primary">Voir la fiche établissement</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
);

export default Update;
