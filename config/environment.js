/* eslint-env node */
'use strict';

module.exports = function(environment) {
  var deployTarget = process.env.DEPLOY_TARGET;
  let ENV = {
    modulePrefix: 'smallrobotco',
    environment,
    rootURL: '/',
    host: 'https://api.smallrobot.co/', //drupal
    namespace: 'api',
    locationType: 'router-scroll',
    historySupportMiddleware: true,

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
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
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['all'],
        config: {
          id: 'UA-110529542-1',
          // Use `analytics_debug.js` in development
          debug: environment === 'test',
          // Use verbose tracing of GA events
          trace: environment === 'test',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'test',
          // Specify Google Analytics plugins
          require: ['']
        }
      }//,
      // {
      //   name: 'Mixpanel',
      //   environments: ['production'],
      //   config: {
      //     token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453'
      //   }
      // },
      // {
      //   name: 'Segment',
      //   environments: ['production'],
      //   config: {
      //     key: '4fce-8a0f-a9a8f89d1453'
      //   }
      // },
      // {
      //   name: 'Piwik',
      //   environments: ['production'],
      //   config: {
      //     piwikUrl: 'http://piwik.my.com',
      //     siteId: 42
      //   }
      // },
      // {
      //   name: 'Intercom',
      //   environments: ['production'],
      //   config: {
      //     appId: 'def1abc2'
      //   }
      // },
      // {
      //   name: 'FacebookPixel',
      //   environments: ['production'],
      //   config: {
      //     id: '1234567890'
      //   }
      // },

      // {
      //   name: 'LocalAdapter',
      //   environments: ['all'], // default
      //   config: {
      //     foo: 'bar'
      //   }
      // }
    ],

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created

    },

    fastboot: {
      hostWhitelist: ['smallrobot.co', 'dev.smallrobot.co', /^localhost:\d+$/],
      // EXPERIMENTAL_RENDER_MODE_SERIALIZE: true
    }
  };

  if (environment === 'development') {
    // ENV.APP.EXPERIMENTAL_RENDER_MODE_SERIALIZE = true;
    // ENV.APP.FASTBOOT_DISABLED = true;
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
    ENV.APP.host = 'https://smallrobot.co/api' //drupal
  }

  if (deployTarget === 'staging') {
    ENV.rootURL = '/smallrobot/';
  }

  if (deployTarget === 'production') {
    ENV.rootURL = '/';
  }

  return ENV;
};
