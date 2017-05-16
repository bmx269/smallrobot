import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = Ember.Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('development', function() {
    this.route('app');
    this.route('drupal');
  });
  this.route('consulting', function() {
    this.route('web');
  });
  this.route('support', function() {
    this.route('drupal');
  });
  this.route('work', function() {
    this.route('stories', function() {
      this.route('story');
    });
  });
  this.route('blog', function() {
    this.route('post');
  });
  this.route('about');
  this.route('loading');
  this.route('notfound', {path: '*path'});
});

export default Router;
