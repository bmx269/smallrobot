/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const crawl = require('prember-crawler');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'autoprefixer': {
      browsers: [
        'ie 11',
        'last 1 Chrome versions',
        'last 1 Firefox versions',
        'last 1 Edge versions',
        'last 1 Safari versions',
        'last 1 ios versions',
        'last 1 ChromeAndroid versions'
      ],
      cascade: false
    },
    'ember-cli-template-lint': {
      testGenerator: 'qunit' // or 'mocha', etc.
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
        'favicons/**/*',
        'fonts/**/*',
        'img/**/*',
        'https://api.smallrobot.co/api/(.+)',
        'https://api.smallrobot.co/sites/default/files/*.(?:jpg|gif|png)'
      ],
      requestMode: 'cors',
      lenientErrors: true,
      version: '46'
    },
    'esw-cache-fallback': {
      patterns: [
        'https://api.smallrobot.co/api/(.+)',
        'https://api.smallrobot.co/sites/default/files/*.(?:jpg|gif|png)'
      ],
      // changing this version number will bust the cache
      version: '46'
    },
    'esw-prember': {
      version: '46'
    },
    'prember': {
      baseRoot: 'https://smallrobot.co',
      urls: crawl
    },
    fingerprint: {
      enabled: false
    },
    SRI: {
      enabled: false
    }
  });
  return app.toTree();
};
