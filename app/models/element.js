import DS from 'ember-data';

export default DS.Model.extend({
  column: DS.belongsTo('column'),
  text: DS.hasMany('text'),
  image: DS.hasMany('image'),
  listing: DS.hasMany('listing'),
  // video: DS.hasMany('video'),
  slideshow: DS.hasMany('slideshow')
});
