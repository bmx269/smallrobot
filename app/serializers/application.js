import JSONAPISerializer from '@ember-data/serializer/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute(key) {
    return key;
  },
  keyForRelationship(key) {
    return key;
  }
});
