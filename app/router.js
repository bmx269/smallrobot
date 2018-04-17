import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';
import { inject } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  headData: inject(),
  rootURL: config.rootURL,
  metrics: inject(),

  // setTitle(title) {
  //   this.get('headData').set('title', title);
  // },

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.getWithDefault('currentRouteName', 'unknown');

      this.metrics.trackPage({ page, title });
    });
  }
});

Router.map(function() {
  this.route('home', { path: '/' });
  this.route('about');
  this.route('consulting');
  this.route('development', function() {
    this.route('approach');
  });
  this.route('support');
  this.route('pricing');
  this.route('contact');
  this.route('blog', { path: 'ideas' }, function() {
    this.route('post', { path: ':article_id' });
  });
  this.route('loading');
  // this.route('page', { path: ':slug'});
  this.route('notfound', { path: '/*path' });

});

export default Router;
