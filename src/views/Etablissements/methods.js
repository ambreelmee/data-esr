const getFormattedAddress = address => `${address.address_1}, ${address.zip_code} ${address.city}`;

const getActiveEntity = entities =>
  entities.find(entity => entity.status === 'active');

const getActiveEntities = entities =>
  entities.filter(entity => entity.status === 1);

const getArchivedEntities = entities =>
  entities.filter(entity => entity.status === 'archived');

export { getFormattedAddress, getActiveEntity, getActiveEntities, getArchivedEntities };
