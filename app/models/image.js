import DS from 'ember-data';

export default DS.Model.extend({
  image: DS.belongsTo('file'),
  thumbnail: DS.belongsTo('file'),
  element: DS.belongsTo('element'),
});
