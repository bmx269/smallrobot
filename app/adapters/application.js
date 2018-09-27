import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend(AdapterFetch, {
  // host: ENV.host,
  namespace: ENV.namespace,
  // buildURL(record, suffix) {
  //   return this._super(record, suffix) + '?_format=api_json';
  // },
  pathForType(type) {
    return type.replace('--', '/').replace('-', '_');
  },
  ajaxOptions() {
    const options = this._super(...arguments) || {};
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/vnd.api+json';
    return options;
  }
});
