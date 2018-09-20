/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'autoprefixer': {
      browsers: [
        'ie 11',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Edge versions',
        'last 2 Safari versions',
        'last 2 ios versions',
        'last 2 ChromeAndroid versions'
      ],
      cascade: false
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-cli-image-transformer': {
      images: [
        {
          inputFilename: 'public/img/icon.png',
          outputFileName: 'appicon-',
          convertTo: 'png',
          destination: 'assets/icons/',
          sizes: [32, 192, 280, 512]
        },
        {
          inputFilename: 'public/img/splash.png',
          outputFileName: 'appsplash-',
          convertTo: 'png',
          destination: 'assets/splashes/',
          sizes: [512]
        }
      ]
    },
    'ember-service-worker': {
      enabled: true,
      versionStrategy: 'every-build'
    },
    'asset-cache': {
      include: [
        'assets/**/*',
        'img/**/*',
        '/api/(.+)',
        'https://api.smallrobot.co/sites/default/files/(.+)'
      ],
      version: '14'
    },
    'esw-cache-first': {
      patterns: [
        '/api/(.+)',
        'https://api.smallrobot.co/sites/default/files/(.+)'
      ]
    },
    'esw-cache-fallback': {
      patterns: [
        '/api/(.+)',
        'https://api.smallrobot.co/sites/default/files/(.+)'
      ],
    }
  });
  return app.toTree();
};
