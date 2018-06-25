const getFormattedAddress = address => `${address.address_1}, ${address.zip_code} ${address.city}`;

const getActiveEntity = entities =>
  entities.find(entity => entity.status === 'active');

const getActiveEntities = entities =>
  entities.filter(entity => entity.status === 'active');

const getArchivedEntities = entities =>
  entities.filter(entity => entity.status === 'archived');

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export { getFormattedAddress, getActiveEntity, getActiveEntities, getArchivedEntities };
