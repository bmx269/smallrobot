import Route from '@ember/routing/route';
import RSVP from 'rsvp';
// import { run } from "@ember/runloop";

export default Route.extend({

  model(params) {
    return RSVP.hash({
      page: this.store.findRecord('page', 'd19f7a25-ae82-4fb7-bc0b-3fd4a70a51c9'),
    });
  },

  setupController(controller, models) {
    controller.set('page', models.page);
  }
});


