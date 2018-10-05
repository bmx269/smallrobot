import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.tagName = 'div';
    this.classNames = ['main-nav'];
  }
});
