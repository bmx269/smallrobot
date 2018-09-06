import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.breakpoints = {
      320: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      900: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 80
      }
    };
  }
});
