import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({

  model() {
    return RSVP.hash({
      page: this.store.findRecord('page', '3e3126a1-7ae1-495a-96c0-2ede1e8b4ca5'),
    });
  },

  setupController(controller, models) {
    controller.set('page', models.page);
  }
});
