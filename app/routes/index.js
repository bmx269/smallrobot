import { setProperties } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  headData: service(),

  model() {
    return RSVP.hash({
      page: this.store.findRecord('page', '93aec22a-3710-4fe0-ae09-663f6790bb79'),
    });
  },

  afterModel() {
    return setProperties(this.headData, {
      title: 'Small Robot Co. | Vancouver Web Design, Technical Consulting, App Development, & Support',
      description:
      'We are a Vancouver, BC based Web Design, Technical Consulting, Web Development, and Support company, specializing in Drupal, Ember.js, websites and web apps.',
      type: 'website',
      url: 'https://smallrobot.co/'
    });
  },
  setupController(controller, models) {
    controller.set('page', models.page);
  },

});
