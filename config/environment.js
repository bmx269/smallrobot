/* eslint-env node */
'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'smallrobotco',
    environment,
    rootURL: '/',
    host: 'https://api.smallrobot.co', //drupal
    namespace: 'api',
    locationType: 'auto',
    historySupportMiddleware: true,

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    // 'ember-validated-form': {
    //   label: {
    //     submit: 'Go for it!',
    //   },
    //   css: {
    //     // bootstrap classes
    //     group: 'form-group',
    //     control: 'form-control',
    //     label: 'form-label',
    //     checkbox: 'checkbox',
    //     radio: 'radio',
    //     help: 'help-block',
    //     hint: 'help-block',
    //     button: 'btn btn-default',
    //     submit: 'btn btn-primary'
    //   }
    // },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: ['smallrobot.co', 'dev.smallrobot.co', /^localhost:\d+$/]
    }
  };

  if (environment === 'development') {
    ENV.APP.FASTBOOT_DISABLED = true;
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // anything here will be deployed to staging and production
    ENV.APP.host = 'https://api.smallrobot.co'//drupal
  }

  if (deployTarget === 'staging') {
    ENV.rootURL = '/smallrobot/';
  }

  if (deployTarget === 'production') {
    ENV.rootURL = '/';
  }

  return ENV;
};
