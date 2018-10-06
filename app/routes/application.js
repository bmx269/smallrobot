import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  fastboot: service(),

  model() {
    return RSVP.hash({
      pages: this.store.findAll('page'),
      sections: this.store.findAll('section'),
      columns: this.store.findAll('column'),
      texts: this.store.findAll('text'),
      listings: this.store.findAll('listing'),
      files: this.store.findAll('file'),
      images: this.store.findAll('image'),
      slideshows: this.store.findAll('slideshow'),
      slides: this.store.findAll('slide'),
      articles: this.store.findAll('article')
    });
  },

  setupController(controller, models) {
    controller.set('pages', models.pages);
    controller.set('sections', models.sections);
    controller.set('columns', models.columns);
    controller.set('texts', models.texts);
    controller.set('listings', models.listings);
    controller.set('files', models.files);
    controller.set('images', models.images);
    controller.set('slideshows', models.slideshows);
    controller.set('slides', models.slides);
    controller.set('articles', models.articles);
  }
});
