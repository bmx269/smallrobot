import { setProperties } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  headData: service(),

  model() {
    return this.store.findRecord('page', '37ddbded-ed77-4445-ad5e-40c842d24041');
  },

  afterModel() {
    return setProperties(this.headData, {
      title: 'Small Robot Co. | Support - Ember.js, Drupal, ContentaCMS, Decoupled, Web Apps',
      description:
      'We are a Vancouver, BC based Web Design, Technical Consulting, Web Development, and Support company, specializing in Drupal, WordPress, Ember.js, websites and web apps.',
      type: 'website',
      url: 'https://smallrobot.co/support'
    });
  }
});
